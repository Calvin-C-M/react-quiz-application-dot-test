"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import ReactHtmlParser from 'react-html-parser';
import Button from "@/components/Button";

interface Quiz {
    type: string,
    difficulty: string,
    category: string,
    question: string,
    correct_answer: string,
    incorrect_answers: Array<string>,
    possible_answer: string[]
}

interface APIResp {
    response_status: number,
    results: Array<Quiz>
}

export default function QuizPage() {
    const quizTime = 0.1
    const [loadingPage, setLoadingPage] = useState<boolean>(true)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [quizData, setQuizData] = useState<Array<Quiz>>([])
    const [score, setScore] = useState({
        correct_answer: 0,
        wrong_answer: 0,
        unanswered: 0
    })
    const [timeLeft, setTimeLeft] = useState(quizTime * 60)

    useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft((prevTimeLeft) => prevTimeLeft - 1)
        }, 1000)
    
        axios.get<APIResp>("https://opentdb.com/api.php?amount=10&category=18")
            .then(res => {
                const resData = res.data
                const quiz = resData.results

                quiz.map((data) => {
                    data.possible_answer = data.incorrect_answers
                    data.possible_answer.push(data.correct_answer)
                    data.possible_answer.sort(() => Math.random() - 0.5)
                })

                setQuizData(quiz)

                setScore({
                    correct_answer: 0,
                    wrong_answer: 0,
                    unanswered: quiz.length
                })

                setLoadingPage(false)
            })
            .catch(err => {
                console.error(err)
            })
            
            if(timeLeft == 0) {
                setInterval(() => {
                    setTimeLeft(0)
                }, 0)
                setCurrentPage(15)
            }
            return () => clearInterval(timer)
    }, [timeLeft])

    const nextPage = () => {
        setCurrentPage(currentPage + 1)
    }

    const handleChoiceClick = (selected: string) => {
        if(selected == quizData[currentPage]?.correct_answer) {
            setScore({
                correct_answer: score.correct_answer+1,
                wrong_answer: score.wrong_answer,
                unanswered: score.unanswered-1
            })
        } else {
            setScore({
                correct_answer: score.correct_answer,
                wrong_answer: score.wrong_answer+1,
                unanswered: score.unanswered-1
            })
        }
        nextPage()
    }

    if(loadingPage) {
        return (
            <>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 gap-10 text-neutral font-bold">
                <section className="relative flex items-center justify-center animate-spin">
                    <div className="absolute w-10 h-10 bg-tertiery rounded-full" />
                    <div className="absolute w-5 h-5 bg-neutral rounded-full" />
                    <div className="absolute -bottom-8 w-5 h-5 bg-gray-900 rounded-full" />
                    <div className="absolute -right-8 w-5 h-5 bg-gray-900 rounded-full" />
                    <div className="absolute -top-8 w-5 h-5 bg-gray-900 rounded-full" />
                    <div className="absolute -left-8 w-5 h-5 bg-gray-900 rounded-full" />
                </section>
                <span>Loading Questions...</span>
            </main>
            </>
        )
    } else {
        if(currentPage < quizData.length) {
            const minutes = Math.floor((timeLeft % 3600) / 60)
            const seconds = timeLeft % 60

            const setTimeText = (satuan: number) => (satuan >= 10) ? satuan : `0${satuan}`

            return (
                <>
                <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-neutral">
                    <section className="bg-primary w-[512px] p-5 rounded-md flex flex-col gap-3">
                        <section className="flex items-center justify-between">
                            <span className="w-fit px-2 py-1 font-bold bg-neutral text-primary">{currentPage+1} / {quizData.length}</span>
                            <span className="px-2 py-1 font-bold bg-neutral text-primary">{setTimeText(minutes)} : {setTimeText(seconds)}</span>
                        </section>
                        <p className="max-w-lg">
                            { ReactHtmlParser(quizData[currentPage]?.question ?? "") }
                        </p>
                        <section className="flex flex-col gap-2">
                            {
                                quizData[currentPage]?.possible_answer.map((data, index) => (
                                    <button key={index} className="p-3 text-left bg-secondary hover:bg-tertiery transition-all duration-100" onClick={() => handleChoiceClick(data)}>
                                        { ReactHtmlParser(data) ?? ""}
                                    </button>
                                ))
                            }
                        </section>
                    </section>
                </main>  
                </>
            )
        } 
        return (
            <>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-neutral">
                <section className="bg-primary rounded-md p-5 flex flex-col gap-3">
                    <h1 className="text-4xl font-bold text-center">{(score.correct_answer / quizData.length) * 100}%</h1>
                    <p>Correct Answer: {score.correct_answer}</p>
                    <p>Wrong Answer: {score.wrong_answer}</p>
                    <p>Unanswered: {score.unanswered}</p>
                    <Button href="/" className="mt-5">
                        Logout
                    </Button>
                </section>
            </main>
            </>
        )
    }
}


