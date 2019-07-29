import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {getPost} from "../../actions/post";
import {connect} from 'react-redux';
import PostItem from '../posts/PostItem';
import Spinner from '../layout/Spinner';
import {Link} from "react-router-dom";
import CommentForm from "./CommentForm";

const Post = ({getPost, post: {post, loading}, match}) => {
    useEffect(() => {
       getPost(match.params.id);
    }, [getPost]);
    return loading || post === null ? <Spinner /> : <Fragment>
        <Link to='/posts' className='btn btn-dark'>
            Go Back To Posts
        </Link>
        <PostItem post={post} showActions={false} />
        <CommentForm postId={post._id} />
    </Fragment>
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
   post: state.post
});

export default connect(mapStateToProps, {getPost})(Post);
