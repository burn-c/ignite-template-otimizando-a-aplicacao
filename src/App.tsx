import { useCallback, useEffect, useState } from 'react';

import { SideBar } from './components/SideBar';
import { Content } from './components/Content';

import { api } from './services/api';

import './styles/global.scss';

import './styles/sidebar.scss';
import './styles/content.scss';

type GenreResponseProps = {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

type MovieProps = {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

const getMovies = (selectedGenreId: number) => api
  .get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`)
  .then(response => response.data)

const getGenere = (selectedGenreId: number) => api
  .get<GenreResponseProps>(`genres/${selectedGenreId}`)
  .then(response => response.data)

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  const getMoviesByGenere = useCallback(async () => {
    try {
      const [moviesList, genre] = await Promise.all([
        getMovies(selectedGenreId),
        getGenere(selectedGenreId)
      ])

      setMovies(moviesList);
      setSelectedGenre(genre);
    } catch (e) {
      return console.error(e)
    }
  }, [selectedGenreId])

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    getMoviesByGenere()
  }, [getMoviesByGenere]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SideBar
        genres={genres}
        selectedGenreId={selectedGenreId}
        buttonClickCallback={handleClickButton}
      />

      <Content
        selectedGenre={selectedGenre}
        movies={movies}
      />
    </div>
  )
}