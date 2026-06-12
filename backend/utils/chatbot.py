from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA

def get_qa_chain(vector_db):

    llm = ChatGoogleGenerativeAI(
        model="gemini-flash-lite-latest",
        temperature=0.3
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vector_db.as_retriever()
    )

    return qa_chain