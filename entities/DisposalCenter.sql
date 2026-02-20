{
  "name": "DisposalCenter",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the disposal center"
    },
    "address": {
      "type": "string",
      "description": "Full address"
    },
    "latitude": {
      "type": "number",
      "description": "Latitude coordinate"
    },
    "longitude": {
      "type": "number",
      "description": "Longitude coordinate"
    },
    "operating_hours": {
      "type": "string",
      "description": "Operating hours"
    },
    "phone": {
      "type": "string",
      "description": "Contact phone number"
    },
    "accepts_types": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Types of oil accepted"
    },
    "is_active": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "name",
    "address"
  ]
}