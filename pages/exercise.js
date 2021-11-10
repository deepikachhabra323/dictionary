import Head from "next/head";
import { useState } from "react";
import Link from 'next/link';
import styles from "../styles/Home.module.css";
// const { v4: uuidv4 } = require("uuid");
const axios = require("axios").default;

var subscriptionKey = "bf400f67a2364b5f8a289cdc4c39ee40";
var endpoint = "https://api.cognitive.microsofttranslator.com";

// Add your location, also known as region. The default is global.
// This is required if using a Cognitive Services resource.
var location = "southeastasia";
export default function Home() {
  let [word, setWord] = useState("");
  let [examples, setExamples] = useState({});

  const callApi = (single, cb) => {
    
    axios({
      method: "GET",
      url: `https://wordsapiv1.p.rapidapi.com/words/${single}`,
      headers: {
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        "x-rapidapi-key": "80d6e6da3dmsh6ef87e458499d63p1322b1jsn4b89906e9d22",
      },
    }).then(function (response) {
      // cb2(response.data[0].translations[0].text);
      let exampleSet = [];
      
      response?.data?.results
        .filter((res) => {
          return res?.examples ? true : false;
        })
        .map((res) => {
          return res.examples.map((w) => {
            exampleSet.push(w.split(single).join('_________'));
            cb(exampleSet)
          });
        });
        // setExamples(final);
      // setExamples({ ...examples, [single]: exampleSet });
      console.log(response);
    });
  };
  const getResults = () => {
    let words = word.split(",");
    let final = examples;
    words.map((single) => {
      if (!final[single]) {
        // results[single] = [];
        callApi(
          single,
          (exampleSet)=>{
            final = { ...final, [single]: exampleSet }
            setExamples(final);
          }
        );
      }
    });
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Word Dictionary</title>
      </Head>
      <nav>
        <span style={{padding:'15px',color:'blue',display:'inline-block'}}>
          <Link href="/">Dictionary</Link>
        </span>
        <span style={{padding:'15px',color:'blue',display:'inline-block'}}>
          <Link href="/exercise">Exercise</Link>
        </span>
      </nav>
      <main className={styles.main} style={{alignItems:'normal',maxWidth:'800px',margin:'auto'}}>
        <h1 className={styles.title}>Welcome to Word Exercise!</h1>
        <form
        style={{textAlign:'center'}}
          onSubmit={(e) => {
            e.preventDefault();
            getResults(e);
          }}
        >
          <input
            onChange={(e) => {
              setWord(e.target.value);
            }}
            className={styles.search}
            value={word}
            placeholder="type here"
          />
          <button type="submit">Search</button>
        </form>
        <h3>Excercise:</h3>
        {Object.keys(examples).map((word, i) => {
          return (
            <div key={`example${i}`}>
              <h4>{word}</h4>
              <div>
                {examples[word].map((e) => {
                  return <span>{1+i}. {e}<br/></span>;
                })}
              </div>
            </div>
          );
        })}
        <section style={{marginTop:'150px'}}>
        <h3>Results:</h3>
        {Object.keys(examples).map((word, i) => {
          return (
            // <div >
              <span key={`result${i}`}>{1+i}. {word} </span>
            // </div>
          );
        })}
        </section>
      </main>
    </div>
  );
}
