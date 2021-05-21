import React, { useState, useEffect } from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import db from './Firebase';
import firebase from "firebase"

function Post({ username, caption, imageUrl, postId, user }) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }
        return () => {
            unsubscribe()
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault()
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment("")
    }
    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt="Keshav Rathi" src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            {/* Header - avtar + username*/}
            <img className="post__image" alt="avtar" src={imageUrl} ></img>
            {/* username + caption */}
            <h4 className="post__text"><strong>{username} :</strong> {caption}</h4>
            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>
            {user && (
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Enter comments..."
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}>

                    </input>
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                </button>
                </form>
            )}

        </div>
    )
}

export default Post;
