/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
} from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { type Property } from "../../domain/Property";
import { uploadFile } from "../../infrastructure/firebaseStorageService";
import { useAuth } from "../../hooks/AuthContext";
import type { PropertyInput } from "../../infrastructure/propertyService";

interface PropertyFormProps {
  initialData?: Partial<Property>;
  onSubmit: (data: PropertyInput) => Promise<void>;
  submitLabel: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  onSubmit,
  submitLabel,
}) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [type, setType] = useState<PropertyInput["type"]>(initialData?.type || "apartamento");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialData?.images || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const keypointsOptions = [
    "Amoblado",
    "Pet Friendly",
    "Incluye servicios",
    "Cerca de transporte",
    "Parqueadero",
    "Balcón",
    "Piscina",
    "Gimnasio",
    "Seguridad 24h",
    "Aire acondicionado"
  ];
  const [keypoints, setKeypoints] = useState<string[]>(initialData?.keypoints || []);
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms?.toString() || "1");
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms?.toString() || "1");
  const [location, setLocation] = useState({
    tower: initialData?.location?.tower?.toString() || "",
    apartment: initialData?.location?.apartment?.toString() || ""
  });
  const [area, setArea] = useState(initialData?.area?.toString() || "");

  useEffect(() => {
    if (images.length > 0) {
      const urls = images.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  }, [images]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleKeypointChange = (kp: string) => {
    setKeypoints((prev) =>
      prev.includes(kp) ? prev.filter((k) => k !== kp) : [...prev, kp]
    );
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("Usuario no autenticado");
      return;
    }
    setError("");
    setLoading(true);
    try {
      let uploadedUrls: string[] = initialData?.images || [];
      if (images.length > 0) {
        uploadedUrls = await Promise.all(
          images.map((file) =>
            uploadFile(file, `properties/${userId}/${Date.now()}_${file.name}`)
          )
        );
      }
      const data: PropertyInput = {
        title,
        description,
        price: Number(price),
        type,
        keypoints,
        bathrooms: Number(bathrooms),
        bedrooms: Number(bedrooms),
        images: uploadedUrls,
        location: {
          tower: Number(location.tower),
          apartment: Number(location.apartment)
        },
        area: Number(area),
        status: initialData?.status || "disponible",
      };
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || "Error al procesar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow"
    >
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <Input
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        aria-label="Descripción"
        className="input w-full mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        required
        placeholder="Descripción"
      />
      <Input
        label="Precio"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as PropertyInput["type"])}
          className="input w-full"
        >
          <option value="apartamento">Apartamento</option>
          <option value="casa">Casa</option>
          <option value="habitación">Habitación</option>
          <option value="parqueo">Parqueo</option>
          <option value="bodega">Bodega</option>
        </select>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Puntos clave</label>
        <div className="grid grid-cols-2 gap-2">
          {keypointsOptions.map((kp) => (
            <label key={kp} className="flex items-center">
              <input
                type="checkbox"
                checked={keypoints.includes(kp)}
                onChange={() => handleKeypointChange(kp)}
                className="mr-2"
              />
              {kp}
            </label>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Input
          label="Baños"
          type="number"
          min={0}
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          required
        />
        <Input
          label="Habitaciones"
          type="number"
          min={0}
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          required
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Input
          label="Torre"
          type="number"
          name="tower"
          min={0}
          value={location.tower}
          onChange={handleLocationChange}
          required
        />
        <Input
          label="Apartamento"
          type="number"
          name="apartment"
          min={0}
          value={location.apartment}
          onChange={handleLocationChange}
          required
        />
      </div>
      <div className="mt-4">
        <Input
          label="Área (m²)"
          type="number"
          min={0}
          value={area}
          onChange={e => setArea(e.target.value)}
          required
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">
          Imágenes (PNG/JPG, max 5MB)
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg"
          multiple
          onChange={handleFileChange}
          className="block w-full"
        />
      </div>
      {previewUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {previewUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt="Preview"
              className="h-24 w-full object-cover rounded"
            />
          ))}
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        className="mt-6"
        disabled={loading}
      >
        {loading ? "Enviando..." : submitLabel}
      </Button>
    </form>
  );
};

export default PropertyForm;