'use client'
import BoltIcon from '@mui/icons-material/Bolt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FavoriteIcon from '@mui/icons-material/Favorite'
import GitHubIcon from '@mui/icons-material/GitHub'
import HubIcon from '@mui/icons-material/Hub'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import RocketLaunch from '@mui/icons-material/RocketLaunch'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import VerifiedIcon from '@mui/icons-material/Verified'
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Link as MuiLink,
  Stack,
  Typography
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import React from 'react'

const REPO_URL =
  'https://github.com/christopherrobin/Christophers-Next-MUI-Template'

const features = [
  {
    icon: <LockOutlinedIcon fontSize="large" color="primary" />,
    title: 'Auth out of the box',
    body: 'NextAuth.js Credentials provider with bcryptjs, JWT sessions, and a protected dashboard route ready to go.'
  },
  {
    icon: <VerifiedIcon fontSize="large" color="primary" />,
    title: 'Type-safe end-to-end',
    body: 'Zod 4 schemas shared between client and server, react-hook-form with zodResolver, TypeScript 6 strict mode.'
  },
  {
    icon: <ScienceOutlinedIcon fontSize="large" color="primary" />,
    title: 'Tests already wired',
    body: 'Jest 30 + React Testing Library co-located with components, plus Playwright 1.59 for full E2E coverage.'
  },
  {
    icon: <CheckCircleIcon fontSize="large" color="primary" />,
    title: 'CI gates every PR',
    body: 'Lint, type-check, unit tests, and Playwright run on push. Pre-commit hooks keep main clean.'
  },
  {
    icon: <HubIcon fontSize="large" color="primary" />,
    title: 'Prisma + PostgreSQL',
    body: 'Prisma 6 with a singleton client, env-validated connection strings, and migrations ready for Railway.'
  },
  {
    icon: <BoltIcon fontSize="large" color="primary" />,
    title: 'Zero-config starter',
    body: 'Next.js 16 App Router on Turbopack, Geist fonts, MUI 9 dark theme, and Vercel-ready out of the box.'
  }
]

const stack = [
  {
    name: 'Next.js',
    version: '16',
    badge:
      'https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white',
    url: 'https://nextjs.org/',
    blurb: 'App Router, Turbopack, server actions, RSC streaming.'
  },
  {
    name: 'React',
    version: '19',
    badge:
      'https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black',
    url: 'https://react.dev/',
    blurb: 'Server Components, hooks-only, no class components.'
  },
  {
    name: 'TypeScript',
    version: 'strict',
    badge:
      'https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white',
    url: 'https://www.typescriptlang.org/',
    blurb: 'Strict mode, end-to-end inference, ES2022 target.'
  },
  {
    name: 'Material UI',
    version: '9',
    badge:
      'https://img.shields.io/badge/Material_UI-9-007FFF?style=for-the-badge&logo=mui&logoColor=white',
    url: 'https://mui.com/',
    blurb: 'Custom theme, Emotion + AppRouterCacheProvider, Geist wired.'
  },
  {
    name: 'Prisma',
    version: '6',
    badge:
      'https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white',
    url: 'https://www.prisma.io/',
    blurb: 'Type-safe ORM, schema migrations, singleton client.'
  },
  {
    name: 'PostgreSQL',
    version: '',
    badge:
      'https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white',
    url: 'https://www.postgresql.org/',
    blurb: 'Battle-tested, ACID, scales to billions of rows.'
  },
  {
    name: 'NextAuth.js',
    version: '4',
    badge:
      'https://img.shields.io/badge/NextAuth.js-4-000000?style=for-the-badge&logo=auth0&logoColor=white',
    url: 'https://next-auth.js.org/',
    blurb: 'Credentials provider, JWT sessions, bcryptjs hashing.'
  }
]

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) =>
          `radial-gradient(circle at 15% 0%, ${alpha(
            theme.palette.primary.main,
            0.18
          )} 0%, transparent 45%), radial-gradient(circle at 90% 10%, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, transparent 40%)`
      }}
    >
      <Container component="main" sx={{ flex: 1, py: { xs: 6, md: 10 } }}>
        {/* Hero */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 4, md: 8 }}
          sx={{ alignItems: 'center', mb: { xs: 8, md: 12 } }}
        >
          <Box sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}>
            <Chip
              icon={<FavoriteIcon />}
              label="Open source · MIT"
              variant="outlined"
              color="primary"
              sx={{ mb: 3, fontWeight: 700 }}
            />
            <Typography variant="h1" color="primary" sx={{ mb: 1 }}>
              Howdy.
            </Typography>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', md: '2.6rem' },
                lineHeight: 1.15
              }}
            >
              Christophers-Next-MUI-Template
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: (theme) => alpha(theme.palette.common.white, 0.75),
                maxWidth: 560,
                mb: 4
              }}
            >
              An opinionated Next.js 16 starter with Material UI 9, NextAuth,
              Prisma, Zod, Jest, and Playwright already wired up. Fork it,
              rename it, ship a product this weekend.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Button
                variant="contained"
                component="a"
                href="/sign-up"
                size="large"
                endIcon={<RocketLaunch />}
                sx={{ minWidth: { sm: 180 } }}
              >
                Sign Up
              </Button>
              <Button
                variant="text"
                component="a"
                href="/sign-in"
                size="large"
                sx={{ minWidth: { sm: 140 } }}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                component="a"
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="large"
                startIcon={<GitHubIcon />}
              >
                View on GitHub
              </Button>
            </Stack>
          </Box>
          <Box
            sx={{
              flexShrink: 0,
              position: 'relative',
              width: { xs: 220, sm: 260, md: 300 },
              height: { xs: 220, sm: 260, md: 300 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Soft halo */}
            <Box
              sx={{
                position: 'absolute',
                inset: -12,
                borderRadius: '50%',
                background: (theme) =>
                  `conic-gradient(from 90deg, ${theme.palette.primary.main}, ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}, ${theme.palette.primary.main})`,
                filter: 'blur(18px)',
                opacity: 0.55
              }}
            />
            {/* Inner orb */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: (theme) =>
                  `3px solid ${alpha(theme.palette.primary.main, 0.6)}`,
                boxShadow: (theme) =>
                  `0 20px 60px ${alpha(theme.palette.primary.main, 0.25)}`,
                background: (theme) =>
                  `radial-gradient(circle at 30% 30%, ${alpha(
                    theme.palette.primary.main,
                    0.35
                  )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 60%, transparent 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-geist-sans, sans-serif)'
              }}
            >
              {/* Big version label */}
              <Box
                sx={{
                  textAlign: 'center',
                  color: 'common.white'
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-geist-mono, monospace)',
                    fontSize: '0.7rem',
                    letterSpacing: 3,
                    color: 'primary.main',
                    mb: 1
                  }}
                >
                  v1
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '3rem', md: '3.75rem' },
                    lineHeight: 1,
                    letterSpacing: -2,
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.5)})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Howdy
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-geist-mono, monospace)',
                    fontSize: '0.65rem',
                    letterSpacing: 2,
                    color: (theme) => alpha(theme.palette.common.white, 0.5),
                    mt: 1
                  }}
                >
                  Next 16 · MUI 9
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>

        {/* The Stack — the actual flex */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h3"
            sx={{
              mb: 1,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.6rem' }
            }}
          >
            Built on the{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              latest
            </Box>
            .
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: (theme) => alpha(theme.palette.common.white, 0.7),
              maxWidth: 640,
              mb: 4
            }}
          >
            Every dependency on its current major. Audited weekly,
            security-pinned, type-safe end to end.
          </Typography>

          {/* Big branded badge wall */}
          <Stack
            direction="row"
            useFlexGap
            sx={{ flexWrap: 'wrap', gap: 1.5, mb: 5 }}
          >
            {stack.map((tech) => (
              <MuiLink
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  transition: 'opacity 0.15s ease',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tech.badge}
                  alt={`${tech.name} ${tech.version}`}
                  style={{ height: 32 }}
                />
              </MuiLink>
            ))}
          </Stack>

          {/* Per-tech breakdown grid */}
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              }
            }}
          >
            {stack.map((tech) => (
              <Card
                key={tech.name}
                elevation={0}
                sx={{
                  p: 2.5,
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  transition: (theme) =>
                    theme.transitions.create(
                      ['border-color', 'background-color'],
                      { duration: theme.transitions.duration.short }
                    ),
                  '&:hover': {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.4),
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04)
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 1,
                    mb: 0.75
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 700, color: 'common.white' }}
                  >
                    {tech.name}
                  </Typography>
                  {tech.version && (
                    <Box
                      sx={{
                        fontFamily: 'var(--font-geist-mono, monospace)',
                        fontSize: '0.7rem',
                        color: 'primary.main',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        border: (theme) =>
                          `1px solid ${alpha(theme.palette.primary.main, 0.25)}`
                      }}
                    >
                      {tech.version}
                    </Box>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: (theme) => alpha(theme.palette.common.white, 0.65),
                    lineHeight: 1.6
                  }}
                >
                  {tech.blurb}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Feature grid */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
            Everything you need.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: (theme) => alpha(theme.palette.common.white, 0.7),
              mb: 5
            }}
          >
            No yak-shaving. No half-finished examples. Just a starter that
            already passes its own tests.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              }
            }}
          >
            {features.map((feature) => (
              <Card
                key={feature.title}
                elevation={0}
                sx={{
                  height: '100%',
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  transition: (theme) =>
                    theme.transitions.create(
                      ['border-color', 'transform', 'box-shadow'],
                      { duration: theme.transitions.duration.short }
                    ),
                  '&:hover': {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.5),
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) =>
                      `0 12px 30px ${alpha(theme.palette.primary.main, 0.12)}`
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: (theme) => alpha(theme.palette.common.white, 0.7),
                    fontSize: '1rem',
                    lineHeight: 1.55
                  }}
                >
                  {feature.body}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Final CTA */}
        <Card
          elevation={0}
          sx={{
            textAlign: 'center',
            border: (theme) =>
              `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.12
              )} 0%, transparent 100%)`
          }}
        >
          <PlayCircleIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Ready in one command.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: (theme) => alpha(theme.palette.common.white, 0.7),
              mb: 4,
              maxWidth: 520,
              mx: 'auto'
            }}
          >
            Clone the repo, copy <code>.env.local.example</code>, run{' '}
            <code>yarn dev</code>. That&apos;s it.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'center' }}
          >
            <Button
              variant="contained"
              component="a"
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="large"
              startIcon={<GitHubIcon />}
            >
              Fork on GitHub
            </Button>
          </Stack>
        </Card>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ mt: 'auto' }}>
        <Container sx={{ py: 4 }}>
          <Divider
            sx={{
              mb: 4,
              borderColor: (t) => alpha(t.palette.primary.main, 0.15),
              backgroundColor: 'transparent'
            }}
          />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' }
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: (t) => alpha(t.palette.common.white, 0.6) }}
            >
              MIT License · Built by{' '}
              <MuiLink
                href="https://github.com/christopherrobin"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ color: 'primary.main', fontWeight: 700 }}
              >
                @christopherrobin
              </MuiLink>
            </Typography>
            <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
              <MuiLink
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: (t) => alpha(t.palette.common.white, 0.7),
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <GitHubIcon fontSize="small" />
                Repository
              </MuiLink>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
