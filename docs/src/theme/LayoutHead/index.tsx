/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import SearchMetadatas from '@theme/SearchMetadatas';
import { DEFAULT_SEARCH_TAG, useTitleFormatter } from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import urljoin from 'url-join';
const useBlogTitleFormatter = (title?: string | undefined): string => {
  const {siteConfig = {}} = useDocusaurusContext();
  const {customFields = {}, titleDelimiter = '|'} = siteConfig;
  const {blogTitle} = customFields;
  return title && title.trim().length
      ? `${title.trim()} ${titleDelimiter} ${blogTitle}`
      : blogTitle;
};

export default function LayoutHead(props) {
  const {
    siteConfig,
    i18n: {
      currentLocale
    }
  } = useDocusaurusContext();
  const {
    favicon,
    baseUrl,
    themeConfig: {
      image: defaultImage,
      metadatas
    },
    url: siteUrl
  } = siteConfig;
  const {
    title,
    description,
    image,
    keywords,
    permalink,
    searchMetadatas
  } = props;
  const blogBaseUrl = urljoin(baseUrl, "blog");
  const metaTitle = useLocation().pathname.startsWith(blogBaseUrl.toString())
      ? useBlogTitleFormatter(title)
      : useTitleFormatter(title);
  const metaImage = image || defaultImage;
  const metaImageUrl = useBaseUrl(metaImage, {
    absolute: true
  });
  const faviconUrl = useBaseUrl(favicon);
  const htmlLang = currentLocale.split('-')[0];
  return <>
      <Head>
        <html lang={htmlLang} />
        {metaTitle && <title>{metaTitle}</title>}
        {metaTitle && <meta property="og:title" content={metaTitle} />}
        {favicon && <link rel="shortcut icon" href={faviconUrl} />}
        {description && <meta name="description" content={description} />}
        {description && <meta property="og:description" content={description} />}
        {keywords && keywords.length && <meta name="keywords" content={keywords.join(',')} />}
        {metaImage && <meta property="og:image" content={metaImageUrl} />}
        {metaImage && <meta name="twitter:image" content={metaImageUrl} />}
        {metaImage && <meta name="twitter:image:alt" content={`Image for ${metaTitle}`} />}
        {permalink && <meta property="og:url" content={siteUrl + permalink} />}
        {permalink && <link rel="canonical" href={siteUrl + permalink} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <SearchMetadatas tag={DEFAULT_SEARCH_TAG} locale={currentLocale} {...searchMetadatas} />

      <Head // it's important to have an additional <Head> element here,
    // as it allows react-helmet to override values set in previous <Head>
    // ie we can override default metadatas such as "twitter:card"
    // In same Head, the same meta would appear twice instead of overriding
    // See react-helmet doc
    >
        {metadatas.map((metadata, i) => <meta key={`metadata_${i}`} {...metadata} />)}
      </Head>
    </>;
}