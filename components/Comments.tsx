import { Post } from "../types"


interface Props {
    post: Post
  }

const Comments = ({post}: Props) => {
  return (
    <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2"/>
        {post.comments.map((comment) => (
            <div key={comment._id}>
                <p ><span className="text-yellow-500">{comment.name}</span>: {comment.comment}</p>
            </div>
        ))}
    </div>
  )
}
 
export default Comments