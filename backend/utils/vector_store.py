import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter

def create_vector_store(documents):
    # Check if there is any text extracted across all documents
    total_text = "".join([d.page_content.strip() for d in documents])

    if not total_text:
        # If the PDF is scanned/empty, create a placeholder document to prevent upsert errors
        from langchain.schema import Document
        meta = documents[0].metadata if documents else {}
        filename = os.path.basename(meta.get("source", "uploaded file"))
        placeholder_doc = Document(
            page_content=(
                f"The document '{filename}' appears to be a scanned image PDF. "
                "Direct text extraction yielded no selectable characters. "
                "To search and query this file, please upload a digital text-based PDF."
            ),
            metadata=meta
        )
        split_docs = [placeholder_doc]
    else:
        # Split documents into chunks for better context retrieval
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        split_docs = text_splitter.split_documents(documents)

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-2"
    )

    # Resolve absolute path to backend/chroma_db
    chroma_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'chroma_db')

    vector_db = Chroma.from_documents(
        documents=split_docs,
        embedding=embeddings,
        persist_directory=chroma_dir
    )

    return vector_db