'use client';

import { useState } from "react";
import ProductsManage from "@/app/ui/productManage/ProductManage";

export default function ProductsPage() {
  const [showProductModal, setShowProductModal] = useState(false);

  return (
    <ProductsManage
      activeTab="products-management"
      showProductModal={showProductModal}
      setShowProductModal={setShowProductModal}
    />
  );
}
