/**
 * GalacticBuf Protocol Implementation
 * Binary serialization protocol for Galactic Energy Council
 */

const TYPE_INTEGER = 0x01;
const TYPE_STRING = 0x02;
const TYPE_LIST = 0x03;
const TYPE_OBJECT = 0x04;

class GalacticBuf {
  /**
   * Encode a JavaScript object into GalacticBuf binary format
   * @param {Object} data - Object with field names as keys
   * @returns {Buffer} Encoded binary data
   */
  static encode(data) {
    const fields = Object.entries(data);
    const fieldCount = fields.length;
    
    // Encode all fields first to calculate total length
    const encodedFields = fields.map(([name, value]) => this.encodeField(name, value));
    const fieldsBuffer = Buffer.concat(encodedFields);
    
    // Create header: [version][field_count][total_length]
    const totalLength = 4 + fieldsBuffer.length; // 4 bytes header + fields
    const header = Buffer.alloc(4);
    header[0] = 0x01; // Protocol version
    header[1] = fieldCount; // Field count
    header.writeUInt16BE(totalLength, 2); // Total message length
    
    return Buffer.concat([header, fieldsBuffer]);
  }

  /**
   * Encode a single field
   */
  static encodeField(name, value) {
    const nameBuffer = Buffer.from(name, 'utf8');
    const nameLength = nameBuffer.length;
    
    const nameLengthByte = Buffer.from([nameLength]);
    const type = this.detectType(value);
    const typeByte = Buffer.from([type]);
    const valueBuffer = this.encodeValue(value, type);
    
    return Buffer.concat([nameLengthByte, nameBuffer, typeByte, valueBuffer]);
  }

  /**
   * Detect the type of a value
   */
  static detectType(value) {
    if (typeof value === 'number' || typeof value === 'bigint') {
      return TYPE_INTEGER;
    } else if (typeof value === 'string') {
      return TYPE_STRING;
    } else if (Array.isArray(value)) {
      return TYPE_LIST;
    } else if (typeof value === 'object' && value !== null) {
      return TYPE_OBJECT;
    }
    throw new Error(`Unsupported type for value: ${value}`);
  }

  /**
   * Encode a value based on its type
   */
  static encodeValue(value, type) {
    switch (type) {
      case TYPE_INTEGER:
        return this.encodeInteger(value);
      case TYPE_STRING:
        return this.encodeString(value);
      case TYPE_LIST:
        return this.encodeList(value);
      case TYPE_OBJECT:
        return this.encodeObject(value);
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  /**
   * Encode 64-bit signed integer (big-endian)
   */
  static encodeInteger(value) {
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(value));
    return buffer;
  }

  /**
   * Encode string with 2-byte length prefix
   */
  static encodeString(value) {
    const stringBuffer = Buffer.from(value, 'utf8');
    const length = stringBuffer.length;
    const lengthBuffer = Buffer.alloc(2);
    lengthBuffer.writeUInt16BE(length);
    return Buffer.concat([lengthBuffer, stringBuffer]);
  }

  /**
   * Encode list (homogeneous array)
   */
  static encodeList(value) {
    if (value.length === 0) {
      // Empty list - default to integer type
      const buffer = Buffer.alloc(3);
      buffer[0] = TYPE_INTEGER; // Element type
      buffer.writeUInt16BE(0, 1); // Element count = 0
      return buffer;
    }
    
    const elementType = this.detectType(value[0]);
    const elementCount = value.length;
    
    const header = Buffer.alloc(3);
    header[0] = elementType;
    header.writeUInt16BE(elementCount, 1);
    
    const elements = value.map(el => {
      if (elementType === TYPE_INTEGER) {
        return this.encodeInteger(el);
      } else if (elementType === TYPE_STRING) {
        return this.encodeString(el);
      } else if (elementType === TYPE_OBJECT) {
        return this.encodeObjectWithoutHeader(el);
      }
    });
    
    return Buffer.concat([header, ...elements]);
  }

  /**
   * Encode object (nested structure) with full header
   */
  static encodeObject(value) {
    return this.encodeObjectWithoutHeader(value);
  }

  /**
   * Encode object without the 4-byte protocol header (for nested objects)
   */
  static encodeObjectWithoutHeader(value) {
    const fields = Object.entries(value);
    const fieldCount = fields.length;
    
    const fieldCountByte = Buffer.from([fieldCount]);
    const encodedFields = fields.map(([name, val]) => this.encodeField(name, val));
    
    return Buffer.concat([fieldCountByte, ...encodedFields]);
  }

  /**
   * Decode GalacticBuf binary data into JavaScript object
   * @param {Buffer} buffer - Binary data to decode
   * @returns {Object} Decoded object
   */
  static decode(buffer) {
    let offset = 0;
    
    // Read header
    const version = buffer[offset++];
    if (version !== 0x01) {
      throw new Error(`Unsupported protocol version: ${version}`);
    }
    
    const fieldCount = buffer[offset++];
    const totalLength = buffer.readUInt16BE(offset);
    offset += 2;
    
    // Read fields
    const result = {};
    for (let i = 0; i < fieldCount; i++) {
      const field = this.decodeField(buffer, offset);
      result[field.name] = field.value;
      offset = field.offset;
    }
    
    return result;
  }

  /**
   * Decode a single field
   */
  static decodeField(buffer, offset) {
    // Read field name
    const nameLength = buffer[offset++];
    const name = buffer.toString('utf8', offset, offset + nameLength);
    offset += nameLength;
    
    // Read type
    const type = buffer[offset++];
    
    // Read value
    const valueResult = this.decodeValue(buffer, offset, type);
    
    return {
      name,
      value: valueResult.value,
      offset: valueResult.offset
    };
  }

  /**
   * Decode a value based on its type
   */
  static decodeValue(buffer, offset, type) {
    switch (type) {
      case TYPE_INTEGER:
        return this.decodeInteger(buffer, offset);
      case TYPE_STRING:
        return this.decodeString(buffer, offset);
      case TYPE_LIST:
        return this.decodeList(buffer, offset);
      case TYPE_OBJECT:
        return this.decodeObject(buffer, offset);
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  /**
   * Decode 64-bit signed integer
   */
  static decodeInteger(buffer, offset) {
    const value = buffer.readBigInt64BE(offset);
    return {
      value: Number(value), // Convert BigInt to Number for easier handling
      offset: offset + 8
    };
  }

  /**
   * Decode string with 2-byte length prefix
   */
  static decodeString(buffer, offset) {
    const length = buffer.readUInt16BE(offset);
    offset += 2;
    const value = buffer.toString('utf8', offset, offset + length);
    return {
      value,
      offset: offset + length
    };
  }

  /**
   * Decode list
   */
  static decodeList(buffer, offset) {
    const elementType = buffer[offset++];
    const elementCount = buffer.readUInt16BE(offset);
    offset += 2;
    
    const elements = [];
    for (let i = 0; i < elementCount; i++) {
      if (elementType === TYPE_INTEGER) {
        const result = this.decodeInteger(buffer, offset);
        elements.push(result.value);
        offset = result.offset;
      } else if (elementType === TYPE_STRING) {
        const result = this.decodeString(buffer, offset);
        elements.push(result.value);
        offset = result.offset;
      } else if (elementType === TYPE_OBJECT) {
        const result = this.decodeObjectWithoutHeader(buffer, offset);
        elements.push(result.value);
        offset = result.offset;
      }
    }
    
    return {
      value: elements,
      offset
    };
  }

  /**
   * Decode object (expects full header)
   */
  static decodeObject(buffer, offset) {
    return this.decodeObjectWithoutHeader(buffer, offset);
  }

  /**
   * Decode object without protocol header (for nested objects)
   */
  static decodeObjectWithoutHeader(buffer, offset) {
    const fieldCount = buffer[offset++];
    
    const result = {};
    for (let i = 0; i < fieldCount; i++) {
      const field = this.decodeField(buffer, offset);
      result[field.name] = field.value;
      offset = field.offset;
    }
    
    return {
      value: result,
      offset
    };
  }
}

module.exports = GalacticBuf;
