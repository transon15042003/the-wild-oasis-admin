import supabase, { supabaseUrl } from "./supabase";

export async function Login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function signup({ fullName, email, password }) {
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        avatar: "",
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function UpdateCurrentUser({ fullName, avatar, password }) {
  let userData = null;
  if (password) userData = { password };
  if (fullName) userData = { data: { full_name: fullName } };

  const { data, error } = await supabase.auth.updateUser(userData);
  if (error) {
    throw error;
  }

  if (!avatar) return data;

  // Upload avatar to storage
  const avatarName = `avatar-${data.user.id}-${Math.random()}`;
  const { error: uploadError } = await supabase.storage
    .from("user_avatars")
    .upload(avatarName, avatar);
  if (uploadError) {
    throw uploadError;
  }

  // Update user with avatar URL
  const { data: updateData, error: updateError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/user_avatars/${avatarName}`,
      },
    });
  if (updateError) {
    throw updateError;
  }

  return updateData;
}
