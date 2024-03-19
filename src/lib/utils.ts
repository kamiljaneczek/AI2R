
import 'dotenv/config'

export async function authorize() {
    const response = await fetch('https://tasks.aidevs.pl/token/helloapi', {
        method: 'POST',     
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
   apikey: process.env.AI_DEVS_API_KEY,
        }),
    }); 

    return await response.json();
};

export async function getQuestion(token: string) {

    // replace all oocurance of - with / in token
    token = token.replace(/-/g, '/');
    const response = await fetch(`https://tasks.aidevs.pl/task/${token}`, {
        method: 'GET',     
      headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
};


export async function setAnswer(token: string, answer: string) {
    token = token.replace(/-/g, '/');
    const response = await fetch(`https://tasks.aidevs.pl/answer/${token}`, {
        method: 'POST',     
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({  
            answer: answer
        }),
    });
    return await response.json();
};


