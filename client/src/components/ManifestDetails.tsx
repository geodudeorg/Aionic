import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import { GitUserContext } from './Protected';
import { Octokit } from 'https://cdn.skypack.dev/@octokit/core';

function ManifestDetails(props) {
  const [mani, setMani] = useState([]);
  const useContextHandler = useContext(GitUserContext);

  //load each manifest for display
  useEffect(() => {
    console.log('we have passed down: ', props.details);
    // const manifests = JSON.parse(props.details[0].manifest);
    console.log('child has these: ', props.details);
    const stateArr = [];
    let counter = 0;
    // loop over passed in array to find correct manifests
    for (const obj of props.details) {
      if (obj.revision === props.sha) {
        const manifests = JSON.parse(obj.manifest);
        for (const manifest of manifests) {
          if (counter >= manifests.length) {
            setMani(stateArr);
            return;
          }
          stateArr.push(
            <div>
              <p>{manifest}</p>
            </div>
          );
          counter++;
          console.log(stateArr);
          setMani(stateArr);
        }
      }
    }
  }, []);

  //back button
  const handleClick = (e) => {
    e.preventDefault();
    props.setDetail(false);
  };

  //push to git
  const handleGit = (e) => {
    e.preventDefault();
    const octokit = new Octokit({
      auth: 'AUTH HERE',
    });
    octokit
      .request('PATCH /repos/{owner}/{repo}/git/refs/heads/{ref}', {
        owner: 'aribengiyat', //should change to UseContextHandler
        repo: 'docker-development-youtube-series',
        ref: 'master',
        sha: props.sha,
        force: true,
      })
      .then((data) => {
        console.log('res is: ', data);
      })
      .catch((err) => {
        console.log('error occured: ', err);
      });
  };

  return (
    <div>
      <button onClick={(e) => handleClick(e)}>Back</button>
      <h1>Manifest Details</h1>
      {mani}
      <button onClick={(e) => handleGit(e)}>Push to git</button>
    </div>
  );
}

export default ManifestDetails;
