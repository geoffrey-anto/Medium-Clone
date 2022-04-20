import { GetStaticProps } from 'next'
import Details from '../../components/Details'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../types'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import Comments from '../../components/Comments'

interface Props {
  post: Post
}

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

const Submitted_Component = () => {
  return (
    <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
      <h3 className='text-3xl font-bold'>Thank you for submitting your comment!</h3>
      <p>Once ithas been approved, it will appear shortly</p>
    </div>
  );
};

const Posts = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log('Comment created')
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }

  return (
    <main>
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
      />
      <Details post={post} />
      <hr className=" mx-auto mt-10 max-w-3xl border border-yellow-500" />

      {submitted ? (
        <Submitted_Component/>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10 mt-10 flex max-w-4xl flex-col p-5"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed the article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment bellow!</h4>
          <hr className="mt-2 py-3" />

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="roudned form-input mt-1 block w-full border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="John Appleseed"
              type="text"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="roudned form-input mt-1 block w-full border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="John Appleseed"
              type="email"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="John Appleseed"
              rows={8}
            />
          </label>
          <div>
            {errors.name && <p className="text-red-500">Name is required</p>}
            {errors.email && <p className="text-red-500">Email is required</p>}
            {errors.comment && (
              <p className="text-red-500">Comment is required</p>
            )}
          </div>
          <input
            type="submit"
            className="focus:shadow-outline 
          cursor-pointer rounded bg-yellow-500 
          py-2 px-4 font-bold text-white shadow 
          hover:bg-yellow-400 focus:outline-none"
          />
        </form>
      )}
      <Comments post={post}/>
    </main>
  )
}

export default Posts

export const getStaticPaths = async () => {
  const query = `*[_type == 'post']{
    _id,
    slug,
  }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post' && slug.current == $slug][0]{
    _id,
    _createdAt,
    slug,
    title,
    author-> {
       name,
       image
  }
    ,
  'comments': *[
  _type == 'comment' && post._ref == ^._id && approved==true],
    description,
    mainImage,
    body[]{
      ..., 
      asset->{
        ...,
        "_key": _id
      },
  }
}`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })
  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60 * 60,
  }
}

//2 05 22
