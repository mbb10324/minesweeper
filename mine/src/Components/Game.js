import { useRef, useEffect, useState } from "react";
import "../App.css";

function Game() {
    //control react with useref
    const ref = useRef(null);
    //win/lose tally using localstorage
    let wincounter = localStorage.getItem('wincounter') || 0
    let losescounter = localStorage.getItem('losescounter') || 0

    //all wrapped in useeffect to fire render
    useEffect(() => {
        //vars
        const grid = document.querySelector(".grid")
        let width = 10
        let bombAmount = 10
        let squaresArray = []
        let isGameOver = false
        console.log(bombAmount)
        
        //working on changing bomb amount based off form submission

        // function setbombAmount(e) {
        //     e.preventDefault()
        //     document.getElementById("difficulty")
        //     bombState = parseInt(e.target[0].value)
        //     console.log(bombState)
        //    }

        //this next stuff handles the timer
        let minutesLabel = document.getElementById("minutes");
        let secondsLabel = document.getElementById("seconds");
        let totalSeconds = 0;
        setInterval(setTime, 1000);
        function setTime() {
            ++totalSeconds;
            secondsLabel.innerHTML = pad(totalSeconds % 60);
            minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
        }
        function pad(val) {
            var valString = val + "";
            if (valString.length < 2) {
                return "0" + valString;
            } else {
                return valString;
            }
        }

        //initial board creation
        function createBoard() {
            //set attributes to place element in div
            const bombsArray = Array(bombAmount).fill("bomb")
            const emptyArray = Array(width * width - bombAmount).fill("valid")
            const gameArray = emptyArray.concat(bombsArray)
            const shuffledArray = gameArray.sort(() => Math.random() - 0.5)
            // console.log(shuffledArray)
            //dynamically create divs
            for (let i = 0; i < width * width; i++) {
                const square = document.createElement('div')
                square.setAttribute('id', i)
                square.classList.add(shuffledArray[i])
                grid.appendChild(square)
                squaresArray.push(square)
                square.addEventListener('click', function (e) {
                    click(square)
                })
            }
            //add numbers to the grid dynamically (functions found online @kubowania)
            for (let i = 0; i < squaresArray.length; i++) {
                let total = 0
                const isLeftEdge = i % width === 0
                const isRightEdge = i % width === -1
                if (squaresArray[i].classList.contains('valid')) {
                    if (i > 0 && !isLeftEdge && squaresArray[i - 1].classList.contains('bomb')) total++
                    if (i > 9 && !isRightEdge && squaresArray[i + 1 - width].classList.contains('bomb')) total++
                    if (i > 10 && squaresArray[i - width].classList.contains('bomb')) total++
                    if (i > 11 && !isLeftEdge && squaresArray[i - 1 - width].classList.contains('bomb')) total++
                    if (i < 98 && !isRightEdge && squaresArray[i + 1].classList.contains('bomb')) total++
                    if (i < 90 && !isLeftEdge && squaresArray[i - 1 + width].classList.contains('bomb')) total++
                    if (i < 88 && !isRightEdge && squaresArray[i + 1 + width].classList.contains('bomb')) total++
                    if (i < 89 && squaresArray[i + width].classList.contains('bomb')) total++
                    squaresArray[i].setAttribute('data', total)
                    // console.log(squaresArray[i])
                }
            }
        }

        //on click handler
        function click(square) {
            let counter = 10
            let currentId = square.id
            if (isGameOver) return
            if (square.classList.contains('checked')) return
            if (square.classList.contains('bomb')) {
                gameOver(square)
            } else {
                let total = square.getAttribute('data')
                if (total != 0) {
                    square.classList.add('checked')
                    square.innerHTML = total
                    checkWin()
                    return
                }
                checkSquare(square, currentId)
                square.classList.add('checked')
                checkWin()
            }

        }

        function checkWin(square) {
            let counter = 10
            for (let i = 0; i < squaresArray.length; i++) {
                if (squaresArray[i].classList.contains('checked')) {
                    counter++
                }
            }
            if (counter === 100) {
                setTimeout(() => { if (!alert('Congratulations, you win! (Press OK to start a new game!)')) { window.location.reload(); } }, 100)
            }
        }

        //recursive function to fill squares around when empty
        function checkSquare(square, currentId) {
            const isLeftEdge = (currentId % width === 0)
            const isRightEdge = (currentId % width === width - 1)
            setTimeout(() => {
                if (currentId > 0 && !isLeftEdge) {
                    const newId = squaresArray[parseInt(currentId) - 1].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId > 9 && !isRightEdge) {
                    const newId = squaresArray[parseInt(currentId) + 1 - width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId > 10) {
                    const newId = squaresArray[parseInt(currentId - width)].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId > 11 && !isLeftEdge) {
                    const newId = squaresArray[parseInt(currentId) - 1 - width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 98 && !isRightEdge) {
                    const newId = squaresArray[parseInt(currentId) + 1].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 90 && !isLeftEdge) {
                    const newId = squaresArray[parseInt(currentId) - 1 + width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 88 && !isRightEdge) {
                    const newId = squaresArray[parseInt(currentId) + 1 + width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 89) {
                    const newId = squaresArray[parseInt(currentId) + width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
            }, 10)

        }

        //You win function
        function checkWin(square) {
            let counter = bombAmount
            for (let i = 0; i < squaresArray.length; i++) {
                if (squaresArray[i].classList.contains('checked')) {
                    counter++
                }
            }
            if (counter === 100) {
                setTimeout(() => { if (!alert('Congratulations, you win! (Press OK to start a new game!)')) { window.location.reload(); } }, 100)
                localStorage.setItem('wincounter', ++wincounter)
            }
        }

        //You lose function
        function gameOver() {
            isGameOver = true
            squaresArray.forEach(square => {
                if (square.classList.contains('bomb')) {
                    square.innerHTML = '💣'
                    square.classList.remove('bomb')
                    square.classList.add('checked')
                }
            })
            setTimeout(() => { if (!alert('You lose! (Press OK to start a new game!)')) { window.location.reload(); } }, 100)
            localStorage.setItem('losescounter', ++losescounter)
        }

        createBoard()
    }, [])

    //render initial grid div, handle the rest ^
    return (
        <>
            <p>Wins: {wincounter} Loses: {losescounter}</p>
            <div><label id="minutes">00</label>:<label id="seconds">00</label></div>
            <form id="difficulty">
                <label htmlFor="fname">Choose your difficulty:</label>
                <select className="dropdown">
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                    <option value="30">30</option>
                </select>
                <input type="submit" value="Submit" className="submit"></input>
            </form>
            <div ref={ref} className="grid">
            </div>
        </>
    )
}

export default Game;