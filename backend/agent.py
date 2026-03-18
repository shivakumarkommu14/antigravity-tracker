import re
from datetime import datetime, timedelta

def parse_natural_language(prompt: str):
    """
    Extremely simple NLP rule-based parser for fast setup.
    In real production, this would call OpenAI or a HuggingFace model.
    """
    prompt_lower = prompt.lower()
    
    # Check for transaction (money involved)
    money_match = re.search(r'\$?\d+(?:\.\d{2})?', prompt)
    if money_match and any(keyword in prompt_lower for keyword in ['pay', 'bought', 'spent', 'cost', 'earned', 'salary', 'income']):
        amount = float(money_match.group().replace('$', ''))
        txn_type = "income" if any(k in prompt_lower for k in ['earned', 'salary', 'income']) else "expense"
        
        return {
            "action": "create_transaction",
            "data": {
                "type": txn_type,
                "amount": amount,
                "description": prompt,
                "category": "auto-categorized"
            }
        }
        
    # Check for loan
    if 'borrowed' in prompt_lower or 'lent' in prompt_lower or 'loan' in prompt_lower:
        money_match = re.search(r'\$?\d+(?:\.\d{2})?', prompt)
        amount = float(money_match.group().replace('$', '')) if money_match else 0.0
        loan_type = "borrowed" if "borrowed" in prompt_lower else "lent"
        return {
            "action": "create_loan",
            "data": {
                "type": loan_type,
                "counterparty": "Unknown",
                "amount": amount
            }
        }
    
    # Default to task
    priority = "High" if "urgent" in prompt_lower or "asap" in prompt_lower else "Medium"
    
    # Simple date parsing
    deadline = None
    if "tomorrow" in prompt_lower:
        deadline = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    elif "today" in prompt_lower:
        deadline = datetime.now().strftime("%Y-%m-%d")
        
    return {
        "action": "create_task",
        "data": {
            "title": prompt,
            "priority": priority,
            "deadline": deadline,
            "category": "General"
        }
    }
