## Cmds

* Get Events

```
rooch event get-events-by-event-handle --event-handle-type 0x701c21bf1c8cd5af8c42983890d8ca55e7a820171b8e744c13f2d9998bf76cc3::grow_information_v3::VoteEvent
```

* Switch Network

```
rooch env switch --alias main
```

## Curls

* Get resource

```
curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"rooch_listStates","params":["/resource/0x3", null, null, {"decode":true}],"id":1}' https://dev-seed.rooch.network:443 | jq
```

* Get table index

```
curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"rooch_listStates","params":["/table/0xf486bd41139780b89e06f5864c58af27d3e71a1feae43c9e9bef5beb587b700b", null, null, {"decode":true}],"id":1}' https://main-seed.rooch.network:443 | jq
```