import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Prismic from 'prismic-javascript'
import { Document } from 'prismic-javascript/types/documents'
import PrismicDOM from 'prismic-dom'
import { client } from '@/lib/prismic'

// interface IProduct {
//   id: string
//   title: string
// }

interface CategoryProps {
  category: Document
  products: Document[]
}

export default function Categories({ category, products }: CategoryProps) {
  const router = useRouter()

  return (
    <div>
      <h1>
        {PrismicDOM.RichText.asText(category.data.title)}
      </h1>

      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`}>
                <a>
                  {PrismicDOM.RichText.asText(product.data.title)}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category')
  ])

  // const response = await fetch('http://localhost:3333/categories')
  // const categories = await response.json()

  const paths = categories.results.map(category => {
    return {
      params: { slug: category.uid }
    }
  })

  return {
    paths: paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  const { slug } = context.params

  const category = await client().getByUID('category', String(slug), {})

  const products = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id)
  ])

  // const response = await fetch(`http://localhost:3333/products?category_id=${slug}`)
  // const products = await response.json()

  return {
    props: {
      category,
      products: products.results
    }
  }
}