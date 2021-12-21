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
  }, [pokemonName])

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

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
          hasError: false,
          error: null,
      };
    }

    
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return {
          hasError: true,
          error: error
      };
    }

    // componentDidCatch(error, errorInfo) {
    //     // You can also log the error to an error reporting service
    //     console.log('didCatch', error, errorInfo)
    // }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
            <div role="alert">
                There was an error: <pre style={{whiteSpace: 'normal'}}>{this.state.error.message}</pre>
            </div>
        )
      }
  
      return this.props.children; 
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
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
