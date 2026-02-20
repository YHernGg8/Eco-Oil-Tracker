{
  "name": "RewardRedemption",
  "type": "object",
  "properties": {
    "reward_id": {
      "type": "string",
      "description": "Reference to the reward"
    },
    "reward_title": {
      "type": "string",
      "description": "Title of the redeemed reward"
    },
    "points_spent": {
      "type": "number",
      "description": "Points used for redemption"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "fulfilled",
        "cancelled"
      ],
      "default": "pending"
    },
    "redemption_code": {
      "type": "string",
      "description": "Unique redemption code"
    }
  },
  "required": [
    "reward_id",
    "points_spent"
  ]
}