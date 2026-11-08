from flask import Flask, request, jsonify
from flask_cors import CORS
from main import create_password_with_analysis

app = Flask(__name__)

CORS(app)


@app.route("/api/generate", methods=["GET", "POST"])
def generate_endpoint():
    """
    Receives password parameters via GET query string or POST JSON body
    and returns the generated password as JSON.
    """
    if request.method == "POST" and request.is_json:
        data = request.get_json()
        raw_length = data.get("length", 16)
        raw_special = data.get("use_special_chars", False)
        raw_capitalization = data.get("capitalization", "title")
    else:
        raw_length = request.args.get("length", default=16)
        raw_special = request.args.get("use_special_chars", default="false")
        raw_capitalization = request.args.get("capitalization", default="title")

    # Safely convert length to an integer and clamp between 4 and 128
    try:
        length = max(4, min(128, int(raw_length)))
    except (ValueError, TypeError):
        length = 16

    # Safely evaluate boolean whether passed as a JSON bool or query string ("true")
    if isinstance(raw_special, bool):
        use_special_chars = raw_special
    else:
        use_special_chars = str(raw_special).lower() in ("true", "1", "yes")

    valid_caps = {"title", "random", "lower", "upper", "full"}
    capitalization = str(raw_capitalization or "title").lower()
    if capitalization not in valid_caps:
        capitalization = "title"

    result = create_password_with_analysis(
        length=length,
        use_special_chars=use_special_chars,
        capitalization=capitalization,
    )
    original_password = result["original"]
    password = result["modified"]
    analysis = result["analysis"]

    return jsonify(
        {
            "password": password,
            "original_password": original_password,
            "length": len(password),
            "use_special_chars": use_special_chars,
            "capitalization": capitalization,
            "analysis": analysis,
        }
    )


if __name__ == "__main__":
    # Runs the local development server on http://localhost:3001
    app.run(host="0.0.0.0", port=3001)
