// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [status, setStatus] = React.useState({
      request: 'idle',
      pokemon: null,
      error: null,
  })
  

  React.useEffect(() => {
    if (!pokemonName) return null

    setStatus({
        request: 'pending',
        pokemon: null,
    })

    fetchPokemon(pokemonName)
        .then( pokemonData => {
            setStatus({
                request: 'resolved',
                pokemon: pokemonData
            })
        })
        .catch( error => {
            setStatus({
                request: 'rejected',
                error: error
            })
        })
  }, [pokemonName])

  switch (status.request) {
    case 'pending':
        return <PokemonInfoFallback name={pokemonName} />
    case 'resolved':
        return <PokemonDataView pokemon={status.pokemon} />
    case 'rejected':
        return (
            <div role="alert">
                There was an error: <pre style={{whiteSpace: 'normal'}}>{status.error.message}</pre>
            </div>
        )
    default:
        return 'Submit a pokemon'
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
