{
  "name": "Reward",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Reward title"
    },
    "description": {
      "type": "string",
      "description": "Reward description"
    },
    "points_required": {
      "type": "number",
      "description": "Points needed to redeem"
    },
    "category": {
      "type": "string",
      "enum": [
        "discount",
        "gift_card",
        "merchandise",
        "donation"
      ],
      "description": "Reward category"
    },
    "image_url": {
      "type": "string",
      "description": "Reward image"
    },
    "is_active": {
      "type": "boolean",
      "default": true
    },
    "stock": {
      "type": "number",
      "description": "Available stock"
    }
  },
  "required": [
    "title",
    "points_required"
  ]
}