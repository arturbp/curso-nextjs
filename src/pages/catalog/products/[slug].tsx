import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Document } from 'prismic-javascript/types/documents'
import PrismicDOM from 'prismic-dom'
import { client } from '@/lib/prismic'
// import dynamic from 'next/dynamic'
// import { useState } from 'react'

// const AddToCartModal = dynamic(
//   () => import('@/components/AddToCartModal'),
//   { loading: () => <p>Loading...</p>, ssr: false }
// )


interface ProductProps {
  product: Document
}

export default function Product({ product }: ProductProps) {

  const router = useRouter()

  if (router.isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <div>
      <h1>{PrismicDOM.RichText.asText(product.data.title)}</h1>

      <img src={product.data.thumbnail.url} width="300" alt=""/>

      <div dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(product.data.description) }}></div>

      <p>Price: {product.data.price}</p>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params

  const product = await client().getByUID('product', String(slug), {})

  return {
    props: {
      product
    },
    revalidate: 10
  }
}