import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [errorFetchingPosts, setErrorFetchingPosts] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then(response => setPosts(response.data))
      .catch(() => setErrorFetchingPosts(true));
  }, []);

  const onEdit = id => {
    setEditMode(true);
    const el = document.querySelector(`#post-body-${id} p`);
    const text = el.innerText;

    const editorContainer = document.createElement('div');
    editorContainer.className = 'post__editor-container';
    const editor = document.createElement('textarea');
    editor.value = text;
    console.log(text);
    const doneBtn = document.createElement('button');
    doneBtn.innerText = 'Done';
    doneBtn.className = 'button button--info';

    editorContainer.appendChild(editor);
    editorContainer.appendChild(doneBtn);

    el.parentNode.replaceChild(editorContainer, el);

    doneBtn.addEventListener('click', () => {
      const p = document.createElement('p');
      p.className = `post-body-${id}`;
      p.innerText = editor.value;
      editorContainer.parentNode.replaceChild(p, editorContainer);
      axios
        .put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
          body: editor.value
        })
        .then(response => console.log('Successfully updated post!'))
        .catch(err => console.log(err))
        .finally(() => setEditMode(false));
    });
  };

  const onDelete = id => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(data => setPosts(posts.filter(post => post.id !== id)))
      .catch(err => console.error('Error deleting resource. ', err));
  };

  console.log(posts);

  const renderPosts = () => {
    if (posts.length === 0 && !errorFetchingPosts) {
      return 'Loading...';
    }

    if (errorFetchingPosts) {
      return 'Error fetching posts.';
    }

    return posts.map(post => {
      return (
        <div className="post" key={post.id}>
          <h2 className="post__title">{post.title}</h2>
          <div id={`post-body-${post.id}`}>
            <p>{post.body}</p>
          </div>
          <div className="post__actions">
            <button
              className="button button--info"
              onClick={() => onEdit(post.id)}
              disabled={editMode}
            >
              Edit Post
            </button>
            <button
              className="button button--danger"
              onClick={() => onDelete(post.id)}
              disabled={editMode}
            >
              Delete Post
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="container">
      <h1>REST API Practice</h1>
      <hr />

      {renderPosts()}
    </div>
  );
}

export default App;
