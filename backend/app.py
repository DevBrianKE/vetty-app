from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# ---------------- DATABASE ----------------
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///dev.db"
)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# INIT DB (IMPORTANT - YOU WERE MISSING THIS)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import models AFTER db init
from models import User, Product, Service, Order, OrderItem, Booking, Review

# ---------------- PRODUCTS ----------------
@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "price": float(p.price),
        "stock": p.stock,
        "image_url": p.image_url
    } for p in products])

@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": float(product.price),
        "stock": product.stock,
        "image_url": product.image_url
    })

# ---------------- SERVICES ----------------
@app.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify([{
        "id": s.id,
        "name": s.name,
        "description": s.description,
        "price": float(s.price)
    } for s in services])

@app.route('/services/<int:id>', methods=['GET'])
def get_service(id):
    service = Service.query.get(id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    return jsonify({
        "id": service.id,
        "name": service.name,
        "description": service.description,
        "price": float(service.price)
    })

# ---------------- ORDERS ----------------
@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    cart_items = data.get("items")

    if not cart_items:
        return jsonify({"error": "No items in cart"}), 400

    total = 0

    order = Order(user_id=1, total_amount=0, status="pending")
    db.session.add(order)
    db.session.flush()

    for item in cart_items:
        product = Product.query.get(item["id"])
        if not product:
            continue

        quantity = item["quantity"]
        total += float(product.price) * quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            price=product.price
        )
        db.session.add(order_item)

    order.total_amount = total
    db.session.commit()

    return jsonify({"message": "Order placed successfully"})

# ---------------- BOOKINGS ----------------
@app.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()

    service_id = data.get("service_id")
    date = data.get("date")
    time = data.get("time")

    if not all([service_id, date, time]):
        return jsonify({"error": "Missing booking details"}), 400

    booking = Booking(
        user_id=1,
        service_id=service_id,
        date=date,
        time=time,
        status="pending"
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({"message": "Booking created successfully"})

# ---------------- RUN (RENDER FIX) ----------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
