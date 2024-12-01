// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0
import ClientProjectDetailPage from './client-page'

export default async function ProjectDetail() {
  // const { slug } = params

  // const projectsResponse = await fetch(
  //   `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_PROJECT_TABLE_ID}?filterByFormula=${encodeURIComponent(`{Slug} = "${slug}"`)}&maxRecords=1`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
  //       'Content-Type': 'application/json',
  //     },
  //     next: {
  //       revalidate: 60 * 4, // Ensure that the reconstruction time is shorter than that of list data.
  //     },
  //   },
  // )
  // const projectRawData = (await projectsResponse.json()).records[0]

  // if (!projectRawData.fields.Show) {
  //   notFound()
  // }

  // const { fields } = projectRawData

  const project: ProjectDetail = {
    id: 'recjtuG6CqIB1J1cr',
    slug: 'rmud',
    name: 'RootMUD DAO',
    description:
      '* Move Game Kit: [https://move-game-kit.rootmud.xyz](https://gamekit.rootmud.xyz/) \n* AI Tool kit: [https://datai.rootmud.xyz](https://datai.rootmud.xyz) \n * Githubs: \n      - [https://github.com/rootmud](https://github.com/rootmud) \n      - [https://gitub.com/noncegeek](https://github.com/noncegeek) \n* Whitepaper: \n  - CN: [https://mp.weixin.qq.com/s/yzIQjbMvcGlzg-IMc7fq4Q](https://mp.weixin.qq.com/s/yzIQjbMvcGlzg-IMc7fq4Q)\n',
    oneLiner: 'Bitcoin-based & AI-powered DAO, buidling Autonomous World on Move.',
    tags: ['DAO', 'Gaming', 'Infra', 'Move'],
    website: 'https://www.rootmud.xyz/',
    community: 'https://t.me/rootmud',
    twitter: 'https://x.com/root_mud',
    github: 'https://github.com/rootmud',
    avatar: 'https://unavatar.io/x/root_mud',
    thumbnail: '',
  }

  return <ClientProjectDetailPage project={project} />
}
