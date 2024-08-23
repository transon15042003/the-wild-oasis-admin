import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function deleteCabin(id) {
  let { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}

export async function insertUpdateCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const image = newCabin.image;

  // Insert a new cabin into the database
  const imageName = `${Math.random()}-${newCabin.image.name}`.replace("/", "");
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin_images/${imageName}`;

  // Query to create or edit cabin
  let query = supabase.from("cabins");

  // Create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // Edit
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be added");
  }

  // Upload the image to the storage
  if (hasImagePath) return data;

  const { storageError } = await supabase.storage
    .from("cabin_images")
    .upload(imageName, image);

  // Delete the cabin IF there was an error uploading image
  if (storageError) {
    console.error(storageError);
    throw new Error("Cabin image could not be added");
  }

  return data;
}
