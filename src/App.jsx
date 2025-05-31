// react 
import { use, useState } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import './App.css'
// components
import StartScereen from './components/StartScreen'
// data 
import { wordsList } from './data/words'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages =[
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},

];

const guessesQty = 3;


function App() {
  const [gameStage, setGaemeStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback( () =>{
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    console.log(category);

    const word = words[category][Math.floor(Math.random() * words[category].length)];
    console.log(word);

    return{word, category};
  }, [words]);

  // starts the secret word game
  const startGame = useCallback(() =>{
    // clear all letters

    clearLetterStates();

    const {word, category} = pickWordAndCategory();

    let wordLetters = word.split("");

    console.log(word, category);
    console.log(wordLetters);

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);


    setGaemeStage(stages[1].name);

  },[pickWordAndCategory]);

  // process the letter input
  const verifyLetter = (letter) =>{
    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utilized

    if(guessedLetters.includes(normalizedLetter) ||
     wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }
    // push guessed letter or remove a chance

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      
      // function to remove a guess
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
    
  };
   
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(() => {
    if(guesses <= 0){
      // reset all states

      clearLetterStates()

      setGaemeStage(stages[2].name);
    }

  }, [guesses]);

  // check win condition
  // create array with unique letters

  useEffect(() => {
    const uniqueLetters = [... new Set(letters)];

    // win condition
    if(guessedLetters.length === uniqueLetters.length){
      // add score
      setScore((actualScore) => actualScore += 100);
      // restart game with new word

      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  // restart the game
  const retry = () =>{
    setScore(0);
    setGuesses(guessesQty);


    setGaemeStage(stages[0].name);
  }

  return (
    <>
      <div className='App'>
       {gameStage === "start" && <StartScereen startGame={startGame}/>}
       {gameStage === "game" &&  <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score}/>}
       {gameStage === "end" &&  <GameOver retry={retry} score={score}/>}
      </div>
    </>
  )
}

export default App
