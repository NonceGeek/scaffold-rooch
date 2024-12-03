// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0
'use client'

import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Image,
  Input,
  Text,
  Title,
  Center,
  Table,
} from '@mantine/core'
import Link from 'next/link'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'

import { IconThumbUp, IconExternalLink } from '@tabler/icons-react'
import {
  useCurrentAddress,
  useCurrentSession,
  useRoochClient,
  useRoochClientQuery,
} from '@roochnetwork/rooch-sdk-kit'
import { Args, Transaction, RoochAddress, BitcoinAddress } from '@roochnetwork/rooch-sdk'
import { AnnotatedMoveStructView } from '@roochnetwork/rooch-sdk/src/client/types/generated'
import { useEffect, useState } from 'react'
import { getTokenInfo } from '@/app/stake/util'
import { useNetworkVariable } from '@/app/networks'
import { WalletConnectModal } from '@/components/connect-model'
import { CreateSessionModal } from '@/components/session-model'
import { formatBalance } from '@/utils/balance'
import Markdown from 'react-markdown'
import 'github-markdown-css'

type VoterInfo = {
  address: string
  value: number
}

type LogEntry = {
  event: string
  date: string
  link?: string
}

export default function ProjectDetail({ project }: { project: ProjectDetail }) {
  console.log(project)
  const [showConnectModel, setShowConnectModel] = useState(false)
  const [showCreateSessionModel, setShowCreateSessionModel] = useState(false)
  const session = useCurrentSession()
  const contractAddr = useNetworkVariable('contractAddr')
  const contractVersion = useNetworkVariable('contractVersion')
  const [balance, setBalance] = useState(-1)
  const [amount, setAmount] = useState('')
  const client = useRoochClient()
  const addr = useCurrentAddress()
  const moduleName = `${contractAddr}::grow_information_${contractVersion}`
  const [loading, setLoading] = useState(false)
  const projectListObj = Args.object({
    address: contractAddr,
    module: `grow_information_${contractVersion}`,
    name: 'GrowProjectList',
  })
  const { data, refetch } = useRoochClientQuery('executeViewFunction', {
    target: `${moduleName}::borrow_grow_project`,
    args: [projectListObj, Args.string(project.slug)],
  })
  const [voters, setVoters] = useState<Array<VoterInfo>>([])
  // TODO: get logs from the deno.
  const [logs] = useState<LogEntry[]>([
    {
      event: 'Released Vote Panel as scaffold-rooch',
      date: '2024-11-30',
      link: 'https://github.com/NonceGeek/scaffold-rooch',
    },
  ])

  /* HINT: DO NOT DELETE THIS COMMENT

  Data Example:

  [
    {
        "value": {
            "type_tag": "0x701c21bf1c8cd5af8c42983890d8ca55e7a820171b8e744c13f2d9998bf76cc3::grow_information_v3::GrowProject",
            "value": "0x04726d756401c1d212ff36b82ad75796ecdd1e8e9f09bca2891ece1945194b6b380dbacbff12314071000000000000000000000000000000000000000000000000000000000001f486bd41139780b89e06f5864c58af27d3e71a1feae43c9e9bef5beb587b700b0000"
        },
        "decoded_value": {
            "abilities": 12,
            "type": "0x701c21bf1c8cd5af8c42983890d8ca55e7a820171b8e744c13f2d9998bf76cc3::grow_information_v3::GrowProject",
            "value": {
                "id": "rmud",
                "metadata": {
                    "abilities": 6,
                    "type": "0x701c21bf1c8cd5af8c42983890d8ca55e7a820171b8e744c13f2d9998bf76cc3::grow_information_v3::GrowMeta",
                    "value": {
                        "key": [],
                        "value": []
                    }
                },
                "vote_detail": {
                    "abilities": 4,
                    "type": "0x2::table::Table<address, u256>",
                    "value": {
                        "handle": {
                            "abilities": 12,
                            "type": "0x2::object::Object<0x2::table::TablePlaceholder>",
                            "value": {
                                "id": "0xf486bd41139780b89e06f5864c58af27d3e71a1feae43c9e9bef5beb587b700b"
                            }
                        }
                    }
                },
                "vote_store": {
                    "abilities": 12,
                    "type": "0x2::object::Object<0x3::coin_store::CoinStore<0x701c21bf1c8cd5af8c42983890d8ca55e7a820171b8e744c13f2d9998bf76cc3::grow_bitcoin::GROW>>",
                    "value": {
                        "id": "0xc1d212ff36b82ad75796ecdd1e8e9f09bca2891ece1945194b6b380dbacbff12"
                    }
                },
                "vote_value": "7422001"
            }
        }
    }
]

  */

  useEffect(() => {
    if (!addr) {
      return
    }
    if (!data || data.vm_status !== 'Executed') {
      return
    }
    getTokenInfo(client, contractAddr).then((result) => {
      client
        .getBalance({
          coinType: result.coinInfo.type,
          owner: addr.genRoochAddress().toStr() || '',
        })
        .then((result) => {
          setBalance(Number(result.balance))
        })
    })
  }, [data, client, contractAddr, addr])

  useEffect(() => {
    if (!data || data.vm_status !== 'Executed') {
      return
    }

    // Get the table handle from the vote_detail field
    const _voteDetail = (data.return_values![0].decoded_value as AnnotatedMoveStructView).value[
      'vote_detail'
    ] as AnnotatedMoveStructView
    // TODO: hard code here, need to change to the var table handle.
    const tableHandle = '0xf486bd41139780b89e06f5864c58af27d3e71a1feae43c9e9bef5beb587b700b'
    // Query the table data
    client
      .listStates({
        accessPath: `/table/${tableHandle}`,
        stateOption: {
          decode: true,
        },
      })
      .then((result) => {
        /* HINT: DO NOT DELETE THIS COMMENT
        {
    "data": [
        {
            "field_key": "0x613b579bfacfb952d28e42f0481b486298eb4a793f6f8cdadb95c6d06eba3fa3",
            "state": {
                "id": "0xf486bd41139780b89e06f5864c58af27d3e71a1feae43c9e9bef5beb587b700b613b579bfacfb952d28e42f0481b486298eb4a793f6f8cdadb95c6d06eba3fa3",
                "owner": "rooch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhxqaen",
                "owner_bitcoin_address": null,
                "flag": 0,
                "state_root": "0x5350415253455f4d45524b4c455f504c414345484f4c4445525f484153480000",
                "size": "0",
                "created_at": "1732526483985",
                "updated_at": "1732526483985",
                "object_type": "0x2::object::DynamicField<address, u256>",
                "value": "0x08f95de5d6e20d590a93b961ae6fa2c489de943a6f55187ef325ffc40a1cdd641027000000000000000000000000000000000000000000000000000000000000",
                "decoded_value": {
                    "abilities": 12,
                    "type": "0x2::object::DynamicField<address, u256>",
                    "value": {
                        "name": "0x08f95de5d6e20d590a93b961ae6fa2c489de943a6f55187ef325ffc40a1cdd64",
                        "value": "10000"
                    }
                },
                "display_fields": null
            }
        },
        {
            "field_key": "0x94c225a34fe579f810ab8da5b4796ae1f6148398187c82049c27298a98e86572",
            "state": {
                "id": "0xf486bd41139780b89e06f5864c58af27d3e71a1feae43c9e9bef5beb587b700b94c225a34fe579f810ab8da5b4796ae1f6148398187c82049c27298a98e86572",
                "owner": "rooch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhxqaen",
                "owner_bitcoin_address": null,
                "flag": 0,
                "state_root": "0x5350415253455f4d45524b4c455f504c414345484f4c4445525f484153480000",
                "size": "0",
                "created_at": "1732526808307",
                "updated_at": "1732876610461",
                "object_type": "0x2::object::DynamicField<address, u256>",
                "value": "0x16f6cb1a8647e31980497c94778f9ce56a8fe51f2d55c333c167b50793847436a1636f0000000000000000000000000000000000000000000000000000000000",
                "decoded_value": {
                    "abilities": 12,
                    "type": "0x2::object::DynamicField<address, u256>",
                    "value": {
                        "name": "0x16f6cb1a8647e31980497c94778f9ce56a8fe51f2d55c333c167b50793847436",
                        "value": "7300001"
                    }
                },
                "display_fields": null
            }
        },
        {
            "field_key": "0xbe181dcf24d53fa521f6942cadf419bfe5ef669cd60b9f16975b6c06e85dcd7c",
            "state": {
                "id": "0xf486bd41139780b89e06f5864c58af27d3e71a1feae43c9e9bef5beb587b700bbe181dcf24d53fa521f6942cadf419bfe5ef669cd60b9f16975b6c06e85dcd7c",
                "owner": "rooch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhxqaen",
                "owner_bitcoin_address": null,
                "flag": 0,
                "state_root": "0x5350415253455f4d45524b4c455f504c414345484f4c4445525f484153480000",
                "size": "0",
                "created_at": "1732690588305",
                "updated_at": "1732708152991",
                "object_type": "0x2::object::DynamicField<address, u256>",
                "value": "0xbc873b62d2cba6e97a07b9a67086ce7f43979b26f8658114e4c10787f802750ee02e000000000000000000000000000000000000000000000000000000000000",
                "decoded_value": {
                    "abilities": 12,
                    "type": "0x2::object::DynamicField<address, u256>",
                    "value": {
                        "name": "0xbc873b62d2cba6e97a07b9a67086ce7f43979b26f8658114e4c10787f802750e",
                        "value": "12000"
                    }
                },
                "display_fields": null
            }
        },
        {
            "field_key": "0xeeb77117006fa9cf6b362c20182972077bf4fa4eab4e79a0c63baab6871e41c9",
            "state": {
                "id": "0xf486bd41139780b89e06f5864c58af27d3e71a1feae43c9e9bef5beb587b700beeb77117006fa9cf6b362c20182972077bf4fa4eab4e79a0c63baab6871e41c9",
                "owner": "rooch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhxqaen",
                "owner_bitcoin_address": null,
                "flag": 0,
                "state_root": "0x5350415253455f4d45524b4c455f504c414345484f4c4445525f484153480000",
                "size": "0",
                "created_at": "1732708352696",
                "updated_at": "1732708352696",
                "object_type": "0x2::object::DynamicField<address, u256>",
                "value": "0xefe83ea327c191494302eb3c27b495f3f33961ef2d35ff47629df353545ec916a086010000000000000000000000000000000000000000000000000000000000",
                "decoded_value": {
                    "abilities": 12,
                    "type": "0x2::object::DynamicField<address, u256>",
                    "value": {
                        "name": "0xefe83ea327c191494302eb3c27b495f3f33961ef2d35ff47629df353545ec916",
                        "value": "100000"
                    }
                },
                "display_fields": null
            }
        }
    ],
    "next_cursor": "0xeeb77117006fa9cf6b362c20182972077bf4fa4eab4e79a0c63baab6871e41c9",
    "has_next_page": false
}
        */
        console.log('result', result)
        const items = result.data
          .map((item) => {
            const view = item.state.decoded_value!.value
            return {
              address: view.name.toString(),
              value: Number(view.value),
            }
          })
          .sort((a, b) => b.value - a.value)
        setVoters(items)
      })
  }, [data, client])

  const handleVote = async () => {
    if (addr === null) {
      setShowConnectModel(true)
      return
    }
    if (session === null) {
      setShowCreateSessionModel(true)
      return
    }
    setLoading(true)
    const tx = new Transaction()
    tx.callFunction({
      target: `${moduleName}::vote_entry`,
      args: [projectListObj, Args.string(project.slug), Args.u256(BigInt(amount))],
    })
    const reuslt = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: session,
    })

    if (reuslt.execution_info.status.type === 'executed') {
      await refetch()
    }

    setLoading(false)
  }

  return (
    <>
      <NavigationBar />
      <WalletConnectModal isOpen={showConnectModel} onClose={() => setShowConnectModel(false)} />
      <CreateSessionModal
        isOpen={showCreateSessionModel}
        onClose={() => setShowCreateSessionModel(false)}
      />
      <Container size="sm" py="xl">
        <Card mt="sm" radius="lg" withBorder>
          <Group align="center">
            <Image src={project.avatar} alt="avatar" w="80" miw="80" h="80" radius="lg" />
            <Box>
              <Title order={2}>{project.name}</Title>
              <Text c="gray.7">{project.oneLiner}</Text>
            </Box>
          </Group>

          <Box mt="lg">
            {/* <Title order={3}>About the Project</Title> */}
            <Markdown
              className="markdown-body"
              components={{
                p: ({ children }) => (
                  <Text mt="xs" mb="xs">
                    {children}
                  </Text>
                ),
                h1: ({ children }) => (
                  <Title order={1} mt="lg" mb="md">
                    {children}
                  </Title>
                ),
                h2: ({ children }) => (
                  <Title order={2} mt="lg" mb="md">
                    {children}
                  </Title>
                ),
                h3: ({ children }) => (
                  <Title order={3} mt="lg" mb="md">
                    {children}
                  </Title>
                ),
                ul: ({ children }) => (
                  <Box component="ul" ml="md" mt="xs" mb="xs">
                    {children}
                  </Box>
                ),
                li: ({ children }) => (
                  <Text component="li" mt="xs">
                    {children}
                  </Text>
                ),
                a: ({ href, children }) => (
                  <Anchor href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </Anchor>
                ),
              }}
            >
              {project.description}
            </Markdown>
          </Box>

          <Box mt="lg">
            <Title order={3}>Tags</Title>
            <Group mt="8">
              {project.tags.map((tag) => (
                <Badge key={tag} bg="dark.3">
                  {tag}
                </Badge>
              ))}
            </Group>
          </Box>

          <Group mt="lg">
            <Anchor
              href={project.website}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
            >
              Website <IconExternalLink size="1em" />
            </Anchor>
            <Anchor
              href={project.community}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
            >
              Community <IconExternalLink size="1em" />
            </Anchor>
            <Anchor
              href={project.twitter}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
            >
              Twitter <IconExternalLink size="1em" />
            </Anchor>
            <Anchor
              href={project.github}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
            >
              Github <IconExternalLink size="1em" />
            </Anchor>
          </Group>
          {data?.vm_status === 'Executed' ? (
            <>
              <Flex
                align={{ base: 'unset', xs: 'center' }}
                justify="space-between"
                gap="xs"
                mt="xl"
                direction={{ base: 'column', xs: 'row' }}
              >
                <Button
                  variant="outline"
                  leftSection={<IconThumbUp size="1.5em" />}
                  radius="xl"
                  disabled={true}
                >
                  {
                    (data!.return_values![0].decoded_value as AnnotatedMoveStructView).value[
                      'vote_value'
                    ] as string
                  }
                </Button>
                <Group gap="0">
                  <Input
                    flex={1}
                    placeholder="Amount"
                    radius="md"
                    disabled={!addr || balance === 0}
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value)
                    }}
                    styles={{
                      input: {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        borderRight: 0,
                      },
                    }}
                  />
                  <Button
                    radius="md"
                    disabled={!addr || balance === 0}
                    loading={loading}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    onClick={handleVote}
                  >
                    Vote
                  </Button>
                </Group>
              </Flex>
              <Flex ta="right" gap="xs" justify="flex-end" mt="6" c="gray.7">
                {addr ? (
                  <>
                    <Text size="sm">{`Your $GROW Balance: ${balance === -1 ? '-' : formatBalance(balance)}`}</Text>
                    {balance === 0 ? (
                      <Link href={'/stake'} style={{ color: 'inherit', fontSize: 'smaller' }}>
                        <Text size="sm">To Stake</Text>
                      </Link>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <Text size="sm">Please connect your wallet first</Text>
                )}
              </Flex>
            </>
          ) : (
            <></>
          )}
          {/*<Card bg="gray.0" radius="lg" mt="xl" p="lg">*/}
          {/*  <Title order={4}>Your Votes</Title>*/}
          {/*  <Text mt="4">*/}
          {/*    You have voted 4 times for the project and earned 4 BitXP as well*/}
          {/*    as 4 Project Alpha XP.*/}
          {/*  </Text>*/}
          {/*</Card>*/}
        </Card>
      </Container>
      <Container size="sm" py="xl">
        <Card mt="sm" radius="lg" withBorder>
          <Flex direction="column">
            <Title order={3} ta="center" mb="md">
              Voter List
            </Title>
            <Text ta="center" mb="md">
              ❤️🤘❤️ List all the voters! ❤️🤘❤️
            </Text>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Address</Table.Th>
                  <Table.Th ta="right">Votes</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {voters.length ? (
                  voters.map((voter) => (
                    <Table.Tr key={voter.address}>
                      
                      
                      <Table.Td>{new RoochAddress(voter.address).toStr()}</Table.Td> 
                      {/* TODO: How to generate bitcoin address? Maybe should refer the code in the wallet connect modal */}
                      {/* <Table.Td>{new BitcoinAddress(voter.address).toStr()}</Table.Td> */}
                      <Table.Td ta="right">{voter.value}</Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Center>
                        <Text c="gray.6">No voters yet.</Text>
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Flex>
        </Card>
      </Container>

      <Container size="sm" py="xl">
        <Card mt="sm" radius="lg" withBorder>
          <Flex direction="column" align="center">
            <Title order={3}>Project Log</Title>
            <Text mt="4">🌱🌸🌺 Record the project&apos;s growth. 🌱🌸🌺</Text>
            <Table mt="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Event</Table.Th>
                  <Table.Th>Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {logs?.length ? (
                  logs.map((log) => (
                    <Table.Tr key={log.date}>
                      <Table.Td>
                        {log.link ? (
                          <Anchor href={log.link} target="_blank" rel="noopener noreferrer">
                            {log.event}
                          </Anchor>
                        ) : (
                          log.event
                        )}
                      </Table.Td>
                      <Table.Td>{new Date(log.date).toISOString().split('T')[0]}</Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Center>
                        <Text c="gray.6">No logs yet.</Text>
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Flex>
        </Card>
      </Container>

      <Footer />
    </>
  )
}
