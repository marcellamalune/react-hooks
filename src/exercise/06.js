// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [status, setStatus] = React.useState('idle')

  React.useEffect(() => {
    if (!pokemonName) return null
    setPokemon(null)
    setStatus('pending')
    fetchPokemon(pokemonName)
        .then( pokemonData => {
            /* update all the state here */
            setPokemon(pokemonData)
            setStatus('resolved')
        })
        .catch( error => {
            setError(error)
            setStatus('rejected')
        })
  }, [pokemonName])

  switch (status) {
    case 'pending':
        return <PokemonInfoFallback name={pokemonName} />
    case 'resolved':
        return <PokemonDataView pokemon={pokemon} />
    case 'rejected':
        return (
            <div role="alert">
                There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
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
