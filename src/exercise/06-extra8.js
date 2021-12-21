// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'


function PokemonInfo({pokemonName, status, setStatus}) {

  React.useEffect(() => {
    if (!pokemonName) return null

    setStatus({
        request: 'pending',
        pokemon: null,
        error: null,
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
  }, [pokemonName, setStatus])

  switch (status.request) {
    case 'pending':
        return <PokemonInfoFallback name={pokemonName} />
    case 'resolved':
        return <PokemonDataView pokemon={status.pokemon} />
    case 'rejected':
        throw status.error
    default:
        return 'Submit a pokemon'
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )
  }

function App() {
  const [pokemonName, setPokemonName] = React.useState(null)
  const [status, setStatus] = React.useState({
    request: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
})

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setStatus({
        request: 'idle',
        pokemon: null,
        error: null,
    })
    setPokemonName(null)
  }

  return (
      <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={handleReset}
        resetKeys={[pokemonName]}
      >
          <PokemonInfo pokemonName={pokemonName} status={status} setStatus={setStatus} />
      </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
