import whisper
import pytube as pt
from transformers import pipeline
import nltk
from newspaper import Article
import openai
from youtube_transcript_api import YouTubeTranscriptApi
import re

# Download the punkt tokenizer for NLTK
nltk.download('punkt')

# Function to get a summary of an article from a given URL
    """
    Input: URL of an article
    Output: Summary of the article
    Purpose: Downloads an article from a URL, parses it, and extracts a summary.
    """
def get_summary(url):

    article = Article(url)
    article.download()
    article.parse()
    article.nlp()
    article_summary = article.summary
    return article_summary


# Function using  model to generate text based on a given prompt
    """
    Input: Text prompt
    Output: Generated text using the model
    Purpose: Utilizes GPT-3 to generate text based on the provided prompt.
    """
def generativemodel(text):

    # API key setup for OpenAI
    openai.api_key = 'YOUR_API_KEY'
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=text,
        temperature=0.7,
        max_tokens=2000,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=1
    )
    content = response.choices[0].text
    return content


# Function to perform fact-checking using Lama Model
   """
    Input: Text to be fact-checked
    Output: Responses from Lama for fact-checking queries
    Purpose: Uses Lama to generate fact-checking queries and retrieve responses.
    """
def fact_check(text_piece):
    query1 = f"check if this is fake news {text_piece} and cite sources with links if it is, and if it's not fake."
    query2 = f"fact check this statement with statistics and official government sources {text_piece} and provide other sources with links."
    response1 = generativemodel(query1)
    response2 = generativemodel(query2)
    return response1, response2
# ... (previous code)

# Function to classify news as fake or real in one word
    """
    Input: Text to determine if it's fake or real news
    Output: Single-word response (boolean) indicating if the news is fake or real
    Purpose: Forms a query for GPT-3 to classify news as fake or real in one word.
    """
def one_word(text_piece):
    query = f"Check and respond with a boolean value whether or not the given news piece is fake or real. Answer in one word. {text_piece}"
    response = generativemodel(query)
    return response


# Function to extract the full text of an article from a given URL
    """
    Input: URL of an article
    Output: Full text of the article
    Purpose: Downloads an article from a URL and extracts its full text.
    """
def get_text(url):

    article = Article(url)
    article.download()
    article.parse()
    article.nlp()
    article_text = article.text
    return article_text

# Function to identify the category or topic of an article
    """
    Input: Text of an article
    Output: Category or topic of the article
    Purpose: Uses zero-shot classification to identify the main category or topic of the article.
    """
def category_identifier(text):

    final_classification = zero_shot_classfier(text, candidate_labels=[
        "sports", "politics", "education", "business", "entertainment", "healthcare and medicine", "science and technology", "religion", "product reviews", "projects and tutorials"])
    return final_classification['labels'][0]

# Function to determine the left or right-leaning bias in an article
    """
    Input: Text of an article
    Output: Score indicating the left-right bias of the article
    Purpose: Determines the left or right-leaning bias in an article using zero-shot classification.
    """
def l_by_r(text):

    final_classification = zero_shot_classfier(
        text, candidate_labels=["left_views", "right_views"], return_all_scores=True)
    return (0.01 * (final_classification['scores'][0] / final_classification['scores'][1]))

# Function to fetch the transcript of a YouTube video
    """
    Input: YouTube video ID
    Output: Full transcript of the video
    Purpose: Fetches the transcript of a YouTube video using the YouTubeTranscriptApi.
    """
def transcript_generation(video_id):

    data = YouTubeTranscriptApi.get_transcript(video_id)
    transscript = [entry['text'] for entry in data]
    transscript = ' '.join(transscript)
    return transscript


