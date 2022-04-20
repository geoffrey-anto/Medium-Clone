import { Post } from "../types"
import PortableText from 'react-portable-text'
import { sanityClient, urlFor } from '../sanity'

interface Props {
    post: Post
}

const Details = ({ post }: Props) => {
  return (
    <article className="mx-auto max-w-4xl px-7 md:px-0">
        <h1 className="mt-10 mb-3 text-5xl">{post.title}</h1>
        <h2 className="mb-10 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2  mb-10">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
          />
          <p className="text-sm font-extralight">
            Post by <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toDateString()}
          </p>
        </div>
        <div>
          <PortableText
            className=""
            dataset={process.env.NEXT_SANITY_DATASET!}
            projectId={process.env.NEXT_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ childern }: any) => (
                <li className="ml-4 list-disc">{childern}</li>
              ),
              link: ({ href, childern }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {childern}
                </a>
              ),
            }}
          />
        </div>
      </article>
  )
}

export default Details