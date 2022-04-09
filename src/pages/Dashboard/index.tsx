import React, { ChangeEvent, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import { Error, Form, Repos, Title } from './styles';

import logo from '../../assets/logo.svg';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

interface GithubRepository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [repos, setRepos] = React.useState<GithubRepository[]>(() => {
    const storageRepos = localStorage.getItem('@GitCollection:repositories');

    if (storageRepos) {
      return JSON.parse(storageRepos);
    }

    return [];
  });
  const [newRepo, setNewRepo] = React.useState('');
  const [inputError, setInputError] = React.useState('');

  React.useEffect(() => {
    localStorage.setItem('@GitCollection:repositories', JSON.stringify(repos));
  }, [repos]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setNewRepo(event.target.value);
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Informe o username/repositório');
      return;
    }

    try {
      const response = await api.get<GithubRepository>(`repos/${newRepo}`);
      const repository = response.data;

      setRepos([...repos, repository]);
      setNewRepo('');
      setInputError('');
    } catch {
      setInputError('Repositório não encontrado no github');
    }
  }

  return (
    <>
      <img src={logo} alt="gitcollection" />
      <Title>Catálogo de repositórios do Github</Title>

      <Form hasError={Boolean(inputError)} onSubmit={handleFormSubmit}>
        <input
          onChange={handleInputChange}
          value={newRepo}
          type="text"
          placeholder="username/repository_name"
        />
        <button type="submit">Buscar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repos>
        {repos.map((repo, index) => (
          <Link
            to={`/repositories/${repo.full_name}`}
            key={repo.full_name + index}
          >
            <img src={repo.owner.avatar_url} alt={repo.owner.login} />
            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repos>
    </>
  );
};

export default Dashboard;
