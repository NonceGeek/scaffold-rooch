// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, Container, Anchor, Flex, Button, UnstyledButton, Stack, Drawer, Menu } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import LogoSVG from '@/assets/logo.svg'

import { IconMenu2, IconChevronDown } from '@tabler/icons-react'
import { useCurrentAddress } from '@roochnetwork/rooch-sdk-kit'
import { shortAddress } from '@/utils/address'
import { WalletConnectModal } from './connect-model'
import { useState } from 'react'

function DesktopNavigationBar({ style }: { style?: any }) {
  const currentAddress = useCurrentAddress()
  const pathname = usePathname()

  const [showConnectModel, setShowConnectModel] = useState(false)

  return (
    <Box style={style}>
      <WalletConnectModal isOpen={showConnectModel} onClose={() => setShowConnectModel(false)} />
      <Container size="lg">
        <Flex py="md" align="center" gap="lg">
          <Link href="/">
            <LogoSVG height={56} />
          </Link>
          <Anchor
            component={Link}
            href="/"
            c="dark"
            underline="never"
            fw={pathname === '/' ? '500' : '400'}
          >
            Home
          </Anchor>
          <Menu trigger="hover" position="bottom">
            <Menu.Target>
              <Anchor
                c="dark"
                underline="never"
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                Earn $GROW <IconChevronDown size={16} />
              </Anchor>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                component="a"
                href="https://grow.rooch.network/stake"
                target="_blank"
                rel="noopener noreferrer"
              >
                Stake 2 Earn
              </Menu.Item>
              <Menu.Item
                component="a"
                href="https://github.com/orgs/NonceGeek/discussions?discussions_q=is%3Aopen+label%3Arooch"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribute 2 Earn
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Anchor
            component="a"
            href="/docs"
            c="dark"
            underline="never"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </Anchor>
          <Anchor
            component="a"
            href="https://grow.rooch.network/portfolio"
            c="dark"
            underline="never"
            target="_blank"
            rel="noopener noreferrer"
          >
            My Portfolio
          </Anchor>
          <Button
            radius="md"
            ml="auto"
            onClick={() => {
              setShowConnectModel(currentAddress === undefined)
            }}
          >
            {currentAddress ? shortAddress(currentAddress.toStr()) : 'Connect Wallet'}
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}

function MobileNavigationBar({ style }: { style?: any }) {
  const [opened, { open, close }] = useDisclosure(false)
  const pathname = usePathname()

  const currentAddress = useCurrentAddress()
  const [showConnectModel, setShowConnectModel] = useState(false)

  return (
    <Box style={style}>
      <WalletConnectModal isOpen={showConnectModel} onClose={() => setShowConnectModel(false)} />
      <Container size="lg">
        <Flex py="md" align="center" gap="lg">
          <Link href="/">
            <LogoSVG height={56} />
          </Link>

          <UnstyledButton
            ml="auto"
            onClick={open}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <IconMenu2 />
          </UnstyledButton>

          <Button
            radius="md"
            onClick={() => {
              setShowConnectModel(currentAddress === undefined)
            }}
          >
            {currentAddress ? shortAddress(currentAddress.toStr()) : 'Connect Wallet'}
          </Button>
        </Flex>
      </Container>

      <Drawer opened={opened} onClose={close} title="Menu">
        <Stack gap="sm">
          <Button
            component={Link}
            href="/"
            style={{ borderRadius: '0.325rem' }}
            variant={pathname === '/' ? 'filled' : 'outline'}
          >
            Home
          </Button>
          <Button
            component="a"
            href="https://grow.rooch.network/stake"
            style={{ borderRadius: '0.325rem' }}
            variant="outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stake 2 Earn
          </Button>
          <Button
            component="a"
            href="https://grow.rooch.network/contribute"
            style={{ borderRadius: '0.325rem' }}
            variant="outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contribute 2 Earn
          </Button>
          <Button
            component={Link}
            href="/projects"
            style={{ borderRadius: '0.325rem' }}
            variant={pathname === '/projects' ? 'filled' : 'outline'}
          >
            Projects
          </Button>
          <Button
            component="a"
            href="/docs"
            style={{ borderRadius: '0.325rem' }}
            variant="outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </Button>
          <Button
            component={Link}
            href="/portfolio"
            style={{ borderRadius: '0.325rem' }}
            variant={pathname === '/portfolio' ? 'filled' : 'outline'}
          >
            My Portfolio
          </Button>
        </Stack>
      </Drawer>
    </Box>
  )
}

export default function NavigationBar({ style }: { style?: any }) {
  const mobileMatches = useMediaQuery('(max-width: 48em)')

  if (mobileMatches) {
    return <MobileNavigationBar style={style} />
  }

  return <DesktopNavigationBar style={style} />
}
