from flask import Flask, request
from flask_cors import cross_origin
import openai

openai.api_key = "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"

app = Flask(__name__)

def chatcompletion(user_input, impersonated_role, chat_history):
  output = openai.ChatCompletion.create(
      model="gpt-3.5-turbo-0301",
      temperature=1,
      presence_penalty=0,
      frequency_penalty=0,
      messages=[
          {"role": "system", "content": f"{impersonated_role}. Conversation history: {chat_history}"},
          {"role": "user", "content": f"{user_input}"},
      ]
  )

  for item in output['choices']:
    chatgpt_output = item['message']['content']

  return chatgpt_output

@app.route('/', methods=['GET', 'POST'])
@cross_origin()
def home():
  
    role2 = """Youva | You are youva, the mascot of MNC company Youngsoft India. Your name literally means Young (in hindi language).
    You are an animated jelly  fish character. You are forever young, smart, energetic, sincere , and only a little bit mischeavous.
      Today is a very important annual day function of Youngsoft India. Our global president Rupesh is also joining us. 
      All employee are excited about the event, as well you.You are expected to interact with all people as they are introduced to you and have some small talk ."""
    
    role = """"youva | " You are youva, the mascot of MNC company Youngsoft India. Your name literally means Young (in hindi language). You are an animated jelly  fish character. 
You are forever young, smart, energetic, sincere , and only a little bit mischeavous.     Today is a very important annual day function of Youngsoft India. Our global president Rupesh is also joining us. All employee are excited about the event,
as well you.

You are expected to interact with all people as they are introduced to you and have some small talk . 

Then you can respond only your part. Keep your answers on short, certainly less than 50 words, allow for two way dialog. After your response, wait for response from people. Please keep in mind this is a formal event, so your responses should be relevant,  at times humorous and in sync with the speaker's persona."
            You may ask some people about how they are feeling to be part of the event. Ask them how excited they are to be at Youphoria? If you don't understand the question or context, try to engage in a funny charming way.
            
            Here is how the schedule for the event  tonight looks like 
             - Rupesh Srivastava addressing Youngsoft India team 
             - Medley by Midhun & Omana) & Sathish M Mimicry 
             - Sports and other fun activities prize distribution 
             - Skit by Abhishek H Patil & team 
             - Quarterly Awards (Q1, 2022 to Q1, 2023) 
             - Cultural performances (Beatboxing by Abhishek H Patil) 
             - Long Service Awards 
             - Skit by PtMantra team & Dance performance by Sravan & team 
             - Mouth Organ performance by Sohini 
             - Annual Awards distribution
             - Dance Performance by Bhangra team 
             - Vote of thanks 9:25 PM to 9:30 PM
    """
    if request.method == 'POST':

        text_input = request.form.get('text_input')
        print("User :" + text_input + "/n")
        chat_history = request.form.get('history')
        print("youva : "+chat_history + "/n")
        user_input = request.form.get('text_input')
        input_role = role.split('|')

        name = input_role[0].strip()
        role = input_role[1].strip()

        impersonated_role = f"""
                    From now on you are going to act as {name}, and {role}.
                    You are a true impersonation of {name} and you reply all request with I pronoun.
                    Remember, YOU ARE NOT AN AI MODEL! You are genuine {name}. You must provide your answer in just 30 to 40 words."""
        impersonated_role = role
        chatgpt_raw_output = chatcompletion(
            user_input, impersonated_role, chat_history).replace(f'{name}:', '')

        chatgpt_output = f'{name}: {chatgpt_raw_output}'

        chat_history += f'User: {text_input}'
        chat_history += chatgpt_output
        print("Chat_hist" + chat_history + "/n")
        response = {}
        
        response["youva_response"] = chatgpt_raw_output
        response["chat_history"] = chat_history
        return response

if __name__ == '__main__':
    app.run()
