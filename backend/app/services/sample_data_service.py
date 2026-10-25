from typing import Dict, Any, List

SAMPLE_PRESETS: Dict[str, Any] = {
    "dishes": [
        {
            "id": "avocado_toast",
            "name": "Artisanal Avocado Toast & Egg",
            "cuisine": "Californian Brunch",
            "calories": 385,
            "protein": 14.5,
            "health_score": 92,
            "image_url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
            "description": "Thick-cut sourdough with fresh smashed avocado, poached egg, chili flakes and microgreens."
        },
        {
            "id": "grilled_salmon",
            "name": "Grilled Wild Salmon & Quinoa",
            "cuisine": "Nordic Clean",
            "calories": 520,
            "protein": 42.0,
            "health_score": 96,
            "image_url": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
            "description": "Crisp-skin wild salmon fillet atop lemon herb quinoa and charred tender asparagus."
        },
        {
            "id": "mediterranean_salad",
            "name": "Greek Mezze Salad with Feta",
            "cuisine": "Mediterranean",
            "calories": 290,
            "protein": 9.2,
            "health_score": 88,
            "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
            "description": "Sun-ripened tomatoes, crisp Persian cucumbers, Kalamata olives, and Greek sheep's milk feta."
        },
        {
            "id": "chicken_biryani",
            "name": "Dum Spiced Chicken Biryani",
            "cuisine": "Indian / South Asian",
            "calories": 640,
            "protein": 34.0,
            "health_score": 75,
            "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
            "description": "Fragrant saffron basmati rice layered with slow-cooked marinated chicken and fresh mint."
        },
        {
            "id": "margherita_pizza",
            "name": "Neapolitan Wood-Fired Margherita",
            "cuisine": "Italian",
            "calories": 720,
            "protein": 28.0,
            "health_score": 68,
            "image_url": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80",
            "description": "San Marzano tomato sauce, fresh buffalo mozzarella, and aromatic basil leaves on blistered dough."
        },
        {
            "id": "berry_acai_bowl",
            "name": "Organic Acai Superfood Bowl",
            "cuisine": "Plant-Based Wellness",
            "calories": 340,
            "protein": 7.5,
            "health_score": 89,
            "image_url": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80",
            "description": "Pure Amazonian acai blended with wild blueberries, topped with hemp seeds and fresh fruit."
        }
    ],
    "freshness_samples": [
        {
            "id": "fresh_avocado",
            "name": "Peak Fresh Hass Avocado",
            "status": "Fresh",
            "shelf_life_hours": 96,
            "browning_index": 8.2,
            "image_url": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&auto=format&fit=crop&q=80"
        },
        {
            "id": "moderately_fresh_berries",
            "name": "Market Strawberries (2 Days Post-Harvest)",
            "status": "Moderately Fresh",
            "shelf_life_hours": 36,
            "browning_index": 34.5,
            "image_url": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop&q=80"
        },
        {
            "id": "spoiled_produce",
            "name": "Oxidized Field Greens with Rot Spotting",
            "status": "Spoiled",
            "shelf_life_hours": 0,
            "browning_index": 82.7,
            "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80"
        }
    ],
    "hygiene_scenarios": [
        {
            "id": "michelin_clean",
            "title": "Station Alpha: 3-Star Prep Line",
            "grade": "A+",
            "score": 97,
            "glove_pct": 98.5,
            "hair_cap_pct": 100.0,
            "cross_contamination": "None Detected",
            "preview_url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80",
            "description": "Strict HACCP compliance, immaculate stainless steel counters, continuous sanitization."
        },
        {
            "id": "bistro_rush",
            "title": "Station Beta: Busy Bistro Dinner Rush",
            "grade": "B",
            "score": 83,
            "glove_pct": 84.0,
            "hair_cap_pct": 91.5,
            "cross_contamination": "Low",
            "preview_url": "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=800&auto=format&fit=crop&q=80",
            "description": "High-volume line plating. Minor glove transition lapses detected during ticket handling."
        },
        {
            "id": "critical_warning",
            "title": "Station Gamma: Prep Hazard Incident",
            "grade": "Critical Violation",
            "score": 54,
            "glove_pct": 52.0,
            "hair_cap_pct": 68.0,
            "cross_contamination": "Critical",
            "preview_url": "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop&q=80",
            "description": "Raw protein cross-contact with ready-to-eat baked buns without glove replacement."
        }
    ],
    "audio_prompts": [
        "Chef, what's a low carb swap for sourdough bread that keeps high fiber?",
        "How do I achieve restaurant-crisp skin on wild salmon without overcooking the center?",
        "Does this meal fit my 2100 calorie daily limit for muscle gain and endurance?",
        "Check this produce for mold or spoilage indicators before I prep the salad."
    ]
}

def get_sample_presets() -> Dict[str, Any]:
    return SAMPLE_PRESETS
