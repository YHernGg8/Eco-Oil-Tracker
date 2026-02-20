{
  "name": "OilDisposal",
  "type": "object",
  "properties": {
    "quantity_liters": {
      "type": "number",
      "description": "Amount of oil disposed in liters"
    },
    "oil_type": {
      "type": "string",
      "enum": [
        "motor_oil",
        "cooking_oil",
        "hydraulic_oil",
        "transmission_fluid",
        "other"
      ],
      "description": "Type of oil disposed"
    },
    "disposal_center_id": {
      "type": "string",
      "description": "Reference to the disposal center"
    },
    "disposal_center_name": {
      "type": "string",
      "description": "Name of the disposal center"
    },
    "points_earned": {
      "type": "number",
      "description": "Reward points earned for this disposal"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "verified",
        "rejected"
      ],
      "default": "pending"
    },
    "notes": {
      "type": "string",
      "description": "Additional notes"
    },
    "photo_url": {
      "type": "string",
      "description": "Photo proof of disposal"
    }
  },
  "required": [
    "quantity_liters",
    "oil_type",
    "disposal_center_id"
  ]
}