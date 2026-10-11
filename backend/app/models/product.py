from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ProductIdentification(Base):
    __tablename__ = "product_identifications"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    scan_id: Mapped[int] = mapped_column(
        ForeignKey("scans.id"),
        nullable=False,
        index=True,
    )

    product_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    category: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )

    material: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )

    confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    raw_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    ai_model: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )

    reasoning: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    mrp: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    quantity: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    expiry_date: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    ingredients: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    allergens: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    fssai_number: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
