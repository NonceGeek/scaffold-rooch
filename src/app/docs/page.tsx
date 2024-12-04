// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0
import getDocumentHTML from './getDocumentHTML'
import ClientDocPage from './client-page'
import './page.scss'

export default async function Docs({
  searchParams,
}: {
  searchParams: { lang?: string }
}) {
  const lang = searchParams.lang || 'en'
  const { contentHTML, tocHTML } = await getDocumentHTML(lang)

  return <ClientDocPage contentHTML={contentHTML} tocHTML={tocHTML} />
}
