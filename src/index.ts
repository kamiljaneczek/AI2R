import { authorize, getQuestion, setAnswer } from './lib/utils';


async function main() {

    let authResponse = null;
    try{
        authResponse =  await authorize();
    }catch(error){
        console.log("Authorization failed: ", error);
    }
    
    let question = null;
    try{
        question = await getQuestion(authResponse.token);
    }   
    catch(error){
        console.log("Getting question failed: ", error);
    }
    console.log("Question: ", question);
    


    let replyAnswer = null;
    try{
        replyAnswer = await setAnswer(authResponse.token,question.cookie);
    }   
    catch(error){
        console.log("Getting question failed: ", error);
    }
    console.log("Answer: ", replyAnswer);

};  


main();