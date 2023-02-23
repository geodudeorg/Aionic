import { useState, useEffect, useRef } from 'react';
import AppsList from './AppsList';
import TokenInput from './TokenInput';

function AppsHub() {
  const [git, setGit] = useState(false);
  const [argo, setArgo] = useState(false);
  const [url, setUrl] = useState(false);
  const [gitUsername, setgitUsername] = useState('')
  // const [username, setUsername] = useState('')
  // const usernameRef = useRef({})

  //check if token and git auth is on serverside
  useEffect(() => {
    fetch('http://localhost:3000/api/checkUser', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((data) => data.json())
      .then((data) => {
        console.log('git username is: ', data.githubId);
        let username = data.githubId
        fetch('http://localhost:3000/api/argoToken?' + new URLSearchParams({
          user: 'aribengiyat'
        }))
          .then((data: Response) => data.json())
          .then((data: []) => {
            console.log(data);
            if (data[0].api_key !== null) {
              console.log('argotoken from endpoint is: ', data)
              setArgo(true);
              setgitUsername(username)
            }
            else return;
          })
          .catch((err) => console.log(err));
      })
  
   

    fetch('http://localhost:3000/api/gitToken')
      .then((data: Response) => data.json())
      .then((data: boolean) => {
        if (data) setGit(true);
      })
      .catch((err) => console.log(err));
  }, []);

  if (!argo) {
    return (
      <div>
        <AppsList gitUsername={gitUsername } />
      </div>
    );
  } else {
    return (
      <div>
        <TokenInput
          tokens={{ argo: argo, git: git, url: url }}
          setGit={setGit}
          setArgo={setArgo}
          setUrl={setUrl}
        />
      </div>
    );
  }
}

export default AppsHub;
