from .models import Destination, Mission

DESTINATIONS = [
    Destination(
        id="dest-1",
        name="GreenCycle CPCB Authorized E-Waste Hub",
        type="Authorized E-Waste Recycler",
        distance_km=1.8,
        address="Industrial Area Phase 2, Sector 82, Mohali",
        accepted_materials=["Li-Ion Battery", "E-Waste", "Cables", "Chargers", "Small Electronics"],
        verified_badge="CPCB Certified #EW-PB-2026",
        qr_code_id="QR-ECOLENS-EW82"
    ),
    Destination(
        id="dest-2",
        name="Swachh Ward 14 Material Recovery Facility (MRF)",
        type="Municipal MRF & Plastic Drop-off",
        distance_km=0.9,
        address="Near Community Center, Sector 70, Mohali",
        accepted_materials=["PET (Code 1)", "HDPE (Code 2)", "Cardboard", "Glass", "Clean Dry Plastic"],
        verified_badge="Municipal Corporation Verified",
        qr_code_id="QR-ECOLENS-MRF14"
    ),
    Destination(
        id="dest-3",
        name="KabaadiConnect Verified Scrap Partner - Rajesh Enterprises",
        type="Verified Local Kabadiwala",
        distance_km=0.5,
        address="Main Market Lane 3, Landran Road",
        accepted_materials=["PET (Code 1)", "HDPE (Code 2)", "Aluminum Cans", "Paper", "Metal"],
        verified_badge="EcoLens Partner • Digital Receipt",
        qr_code_id="QR-ECOLENS-KC03"
    ),
    Destination(
        id="dest-4",
        name="BioCompost Community Pit & Organic Drop",
        type="Composting & Organic Recovery",
        distance_km=1.2,
        address="Green Belt Park Gate 2, Sector 68",
        accepted_materials=["Organic Food Waste", "Expired Dairy/Snacks (Unpacked)", "Garden Waste"],
        verified_badge="Swachh Bharat Mission Partner",
        qr_code_id="QR-ECOLENS-BIO68"
    )
]

SAMPLE_CATALOG = {
    "pet_bottle": {
        "product_name": "Himalayan Mineral Water Bottle (1L)",
        "brand": "NourishCo",
        "category": "Beverage Packaging",
        "confidence": 0.96,
        "extracted_fields": {
            "MRP": "₹20.00 (incl. of all taxes)",
            "Net Quantity": "1000 ml",
            "Best Before": "6 months from manufacture (12/2026)",
            "FSSAI Lic": "10014011001895",
            "Storage": "Store away from direct sunlight"
        },
        "material_info": {
            "primary_material": "PET (Polyethylene Terephthalate)",
            "resin_code": "1 (PETE)",
            "cap_material": "HDPE (Code 2)",
            "recyclability_note": "Resin code 1 is widely recyclable locally, ONLY if emptied, crushed, and kept dry. Do not refill repeatedly for hot liquids."
        },
        "overlooked": [
            {
                "title": "Microplastic Risk on Sun Exposure",
                "severity": "medium",
                "detail": "Label states 'Keep away from direct sunlight' — heat leaches antimony & microplastics into water."
            },
            {
                "title": "Mixed Plastic Cap (HDPE #2 vs PET #1)",
                "severity": "info",
                "detail": "Bottle is PET (#1) while cap is HDPE (#2). Crush bottle and keep cap screwed on so small caps don't get lost in sorting."
            },
            {
                "title": "High Value Local Recyclable",
                "severity": "info",
                "detail": "Clean PET fetches ₹18–₹22/kg at verified Kabadiwalas and MRFs."
            }
        ],
        "waste_recipe": {
            "pathway": "RECYCLE",
            "summary": "Empty completely, rinse lightly if sticky, crush flat, re-attach cap, and drop at dry-waste MRF or Kabadiwala.",
            "do_steps": [
                "Drain all remaining liquid completely.",
                "Crush bottle lengthwise to save 70% transport volume.",
                "Screw the HDPE cap back on so recyclers can recover both polymers."
            ],
            "dont_steps": [
                "Do not throw in wet/organic kitchen dustbin.",
                "Do not stuff non-recyclable wrappers inside the bottle."
            ],
            "safety_note": "Avoid reusing single-use PET bottles for hot water or prolonged sun exposure."
        },
        "potential_credits": 25,
        "estimated_co2_saved_kg": 0.14
    },
    "li_ion_battery": {
        "product_name": "Rechargeable Li-Ion Power Bank / Battery Pack (10000mAh)",
        "brand": "PowerCore X",
        "category": "E-Waste & Hazardous Battery",
        "confidence": 0.94,
        "extracted_fields": {
            "Chemistry": "Lithium-Ion (Li-Ion 3.7V / 37Wh)",
            "BIS Registration": "R-41098234",
            "Disposal Symbol": "Crossed-out Wheeled Bin (Mandatory E-Waste)",
            "Manufacturing Date": "04/2023"
        },
        "material_info": {
            "primary_material": "Lithium Cobalt Oxide + Aluminum Casing + PCB",
            "resin_code": "N/A — Regulated E-Waste (E-Waste Rules 2022)",
            "cap_material": "ABS Flame-Retardant Plastic",
            "recyclability_note": "Contains recoverable Lithium, Cobalt & Copper, but poses severe fire risk in municipal garbage trucks."
        },
        "overlooked": [
            {
                "title": "CRITICAL FIRE HAZARD in Normal Dustbin",
                "severity": "high",
                "detail": "Compaction in regular garbage trucks can puncture Li-Ion cells, causing thermal runaway & toxic fires."
            },
            {
                "title": "Crossed-Out Wheeled Bin Symbol Present",
                "severity": "high",
                "detail": "Legally prohibited from household municipal waste under India E-Waste (Management) Rules."
            },
            {
                "title": "Valuable Critical Minerals Inside",
                "severity": "info",
                "detail": "Authorized CPCB recyclers recover 92% of cobalt, lithium, and copper safely."
            }
        ],
        "waste_recipe": {
            "pathway": "SAFE DISPOSAL",
            "summary": "Tape exposed terminals, store in a cool dry box, and hand over strictly to a CPCB-authorized E-Waste Hub.",
            "do_steps": [
                "Cover battery terminals/ports with non-conductive insulation tape.",
                "Store away from flammable paper or heat until drop-off.",
                "Scan destination QR code at CPCB E-Waste Hub for Disposal Passport."
            ],
            "dont_steps": [
                "NEVER puncture, crush, or attempt DIY battery dismantling at home.",
                "NEVER throw in blue or green household bins."
            ],
            "safety_note": "If the battery is swollen or leaking, place it in a sand-filled container and drop off immediately."
        },
        "potential_credits": 80,
        "estimated_co2_saved_kg": 1.45
    },
    "chips_mlp": {
        "product_name": "Masala Crunch Potato Chips (52g)",
        "brand": "SnackWave India",
        "category": "Multi-Layer Packaging (MLP)",
        "confidence": 0.92,
        "extracted_fields": {
            "MRP": "₹20.00",
            "Net Weight": "52g",
            "Best Before": "15 Dec 2026 (Approaching Soon!)",
            "Allergens": "Contains Milk Solids, Soy; Made in facility handling Peanuts",
            "FSSAI Lic": "10018022007411"
        },
        "material_info": {
            "primary_material": "Multi-Layer Plastic (BOPP + Metallized PET/PE)",
            "resin_code": "7 (OTHER / MLP)",
            "cap_material": "Aluminum Vapor Barrier Layer",
            "recyclability_note": "Resin Code 7 (MLP) is NOT accepted by regular street kabadiwalas. Requires clean dry collection for cement co-processing or pyrolysis."
        },
        "overlooked": [
            {
                "title": "Allergen Alert: Milk & Soy Present",
                "severity": "high",
                "detail": "Contains Milk Solids & Soy Lecithin, plus cross-contamination warning for Peanuts."
            },
            {
                "title": "Resin Code #7 (MLP) — Not Standard Recyclable",
                "severity": "medium",
                "detail": "Fused plastic + metal layers cannot be melted into normal plastic granules; needs dry MRF routing."
            },
            {
                "title": "Best Before Approaching",
                "severity": "info",
                "detail": "Consume before 15 Dec 2026 to prevent food waste."
            }
        ],
        "waste_recipe": {
            "pathway": "RECOVER",
            "summary": "Wipe oil/crumbs clean, keep completely dry, and route to Municipal MRF for energy/cement-kiln recovery.",
            "do_steps": [
                "Shake out food crumbs and wipe inner oil residue with tissue.",
                "Keep flat and dry inside your dry-waste collection bag.",
                "Drop at Municipal MRF (Ward 14) for RDF / co-processing recovery."
            ],
            "dont_steps": [
                "Do not burn MLP packets in open air (releases toxic dioxins).",
                "Do not mix oily wrappers with clean paper/cardboard."
            ],
            "safety_note": "Clean dry MLP avoids contaminating high-grade recyclables."
        },
        "potential_credits": 30,
        "estimated_co2_saved_kg": 0.09
    },
    "expired_biscuits": {
        "product_name": "Whole Wheat Digestive Biscuits (250g)",
        "brand": "NutriBake",
        "category": "Packaged Food & Cardboard Box",
        "confidence": 0.95,
        "extracted_fields": {
            "MRP": "₹45.00",
            "Use By / Expiry": "10 Nov 2026 (EXPIRED 11 DAYS AGO)",
            "Ingredients": "Whole Wheat Flour (55%), Edible Vegetable Oil, Sugar, Malt",
            "Allergens": "Contains Wheat (Gluten)",
            "FSSAI Lic": "10015064000512"
        },
        "material_info": {
            "primary_material": "Outer Carton: Paperboard (PAP 21) + Inner Tray: PP (#5)",
            "resin_code": "5 (PP) + PAP 21",
            "cap_material": "Bi-material (Separable)",
            "recyclability_note": "Outer box and inner PP tray are both recyclable once separated from expired organic food."
        },
        "overlooked": [
            {
                "title": "EXPIRED PRODUCT DETECTED",
                "severity": "high",
                "detail": "Use-By date (10 Nov 2026) has passed. Do not consume or donate expired food."
            },
            {
                "title": "Bi-Material Separation Opportunity",
                "severity": "medium",
                "detail": "Separating the paperboard carton from the inner plastic tray increases recycling recovery by 85%."
            },
            {
                "title": "Organic Compostable Content",
                "severity": "info",
                "detail": "Crushed biscuits can go directly into aerobic compost pits instead of landfill methane."
            }
        ],
        "waste_recipe": {
            "pathway": "RECOVER",
            "summary": "Separate 3 streams: crush biscuits for compost, flatten cardboard box for paper recycling, and dry-rinse PP #5 tray.",
            "do_steps": [
                "Empty expired biscuits into wet/organic compost bin.",
                "Flatten outer cardboard carton and keep dry for Kabadiwala/MRF.",
                "Rinse inner PP (#5) tray and place in dry plastic recycling."
            ],
            "dont_steps": [
                "Do not throw sealed food-filled packets into landfill trash.",
                "Do not donate expired food items."
            ],
            "safety_note": "Check for mold before opening; wash hands after handling spoiled food."
        },
        "potential_credits": 35,
        "estimated_co2_saved_kg": 0.32
    }
}

MISSIONS = [
    Mission(
        id="mis-1",
        title="Swachh E-Waste Zero-Landfill Drive 2026",
        authority="CPCB & Municipal Corporation",
        description="Safely route at least 1 old battery, charger, or small electronic item to an authorized CPCB E-Waste Hub.",
        deadline="30 Nov 2026",
        credits_reward=150,
        participants=1420,
        progress_percent=74,
        badge="E-Waste Guardian"
    ),
    Mission(
        id="mis-2",
        title="Mission LiFE: Beat Multi-Layer Plastic (MLP)",
        authority="Ministry of Environment, Forest & Climate Change",
        description="Divert 5 clean, dry MLP wrappers to your Ward Material Recovery Facility (MRF) with QR proof.",
        deadline="15 Dec 2026",
        credits_reward=100,
        participants=3890,
        progress_percent=61,
        badge="Plastic Smart Citizen"
    ),
    Mission(
        id="mis-3",
        title="Zero-Bin Separation Challenge (Campus & Hostel)",
        authority="CGC Landran Green Club × Smart City",
        description="Scan and properly separate 3 multi-material items into wet, dry recyclable, and hazardous streams.",
        deadline="05 Dec 2026",
        credits_reward=120,
        participants=865,
        progress_percent=82,
        badge="Segregation Pro"
    )
]
