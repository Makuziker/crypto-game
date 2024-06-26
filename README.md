Architecture:
- Each server instance is stateful and runs a single game room
- For now, maintaining game state in-memory is acceptable
- All players in the same room connect to the same server instance
- Scaling out the number of concurrent games will involve spinning up more containers behind a reverse proxy
- Player authentication? Persistent data storage? Token bank? Cryptocurrency exchange? TBD
- Reasons to scale:
    - Max players in a single arena reached
    - Players too far away from existing server instance
- If we need to scale concurrent games, we'll need to decouple frontend into its own static bucket
- If players are far apart, we may need a global network accelerator service to reduce latency (AWS, Ably)

Smart Contracts source code: https://mumbai.polygonscan.com/address/0x8892f0045a34e0fff68156f6b4510a193a004a5a#code
