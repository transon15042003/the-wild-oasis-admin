import supabase from "./supabase";

export async function getDemoMeta() {
    const { data, error } = await supabase
        .from("demo_meta")
        .select("*")
        .eq("id", 1)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Demo status could not be loaded");
    }

    return data;
}

export async function requestDemoReset() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
        throw new Error("You must be logged in to reset demo data");
    }

    const { data, error } = await supabase.functions.invoke("reset-demo", {
        body: { mode: "manual" },
        headers: {
            Authorization: `Bearer ${session.access_token}`,
        },
    });

    if (error) {
        throw new Error(error.message || "Demo reset failed");
    }
    if (data?.error) {
        throw new Error(data.error);
    }

    return data;
}
