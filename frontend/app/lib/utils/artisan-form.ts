import { isValidPhoneNumber } from 'libphonenumber-js';
import type { Artisan } from '../services/artisan';
import type { CreateArtisanPayload } from '../services/artisan';

export interface PhoneNumber {
  number: string;
  isWhatsApp: boolean;
}

export interface SocialMedia {
  platform: string;
  link: string;
}

export interface AddArtisanFormValues {
  fullName: string;
  profession: string;
  zone: string[];
  phoneNumbers: PhoneNumber[];
  socialMedia: SocialMedia[];
  description?: string;
  photo?: File | null;
}

/**
 * Validates a phone number
 */
export function validatePhoneNumber(
  value: string,
  allPhoneNumbers: PhoneNumber[],
  currentIndex: number
): string | null {
  // Skip validation if field is empty
  if (!value || value.trim() === "") {
    const hasOtherValidPhone = allPhoneNumbers.some(
      (p, idx) => idx !== currentIndex && p.number.trim() !== ""
    );
    return hasOtherValidPhone ? null : "Au moins un numéro de téléphone est requis";
  }

  try {
    // Check if the number is valid
    if (!isValidPhoneNumber(value)) {
      return 'Numéro de téléphone invalide';
    }

    return null;
  } catch {
    return 'Numéro de téléphone invalide';
  }
}

/**
 * Transforms form values to API payload format
 */
export function transformFormValuesToPayload(
  values: AddArtisanFormValues,
  isEditMode: boolean,
  isAdmin: () => boolean,
  artisan?: Artisan
): CreateArtisanPayload {
  // Determine profile_photo: new File, existing ID, or undefined
  let profilePhoto: File | number | undefined;
  if (values.photo) {
    // New photo uploaded
    profilePhoto = values.photo;
  } else if (isEditMode && artisan?.profilePhoto?.id) {
    // No new photo, but existing photo exists - keep it
    profilePhoto = artisan.profilePhoto.id;
  }
  // Otherwise profilePhoto is undefined (no photo)

  return {
    full_name: values.fullName,
    description: values.description || "",
    profession: values.profession,
    zones: values.zone,
    phone_numbers: values.phoneNumbers
      .filter((phone) => phone.number.trim() !== "")
      .map((phone) => ({
        number: phone.number.trim(),
        is_whatsapp: phone.isWhatsApp,
      })),
    social_links:
      values.socialMedia.length > 0
        ? values.socialMedia
            .filter((social) => social.platform && social.link)
            .map((social) => ({
              platform: social.platform,
              link: social.link.trim(),
            }))
        : undefined,
    profile_photo: profilePhoto,
    is_community_submitted: isAdmin() ? false : true,
    status: artisan?.status || "approved",
  };
}

/**
 * Generates initial form values from artisan data or defaults
 */
export function getInitialFormValues(artisan?: Artisan): AddArtisanFormValues {
  if (artisan) {
    return {
      fullName: artisan.fullName ?? "",
      profession: artisan.profession?.name ?? "",
      zone: artisan.zones?.map((z) => z.slug) ?? [],
      phoneNumbers:
        artisan.phoneNumbers && artisan.phoneNumbers.length > 0
          ? artisan.phoneNumbers.map((p) => ({
              number: p.number,
              isWhatsApp: p.isWhatsApp,
            }))
          : [{ number: "", isWhatsApp: false }],
      socialMedia:
        artisan.socialLinks && artisan.socialLinks.length > 0
          ? artisan.socialLinks.map((s) => ({
              platform: s.platform,
              link: s.link,
            }))
          : [],
      description: artisan.description ?? "",
      photo: null, // In edit mode, we don't set photo as File, we'll handle it separately
    };
  }

  return {
    fullName: "",
    profession: "",
    zone: [],
    phoneNumbers: [{ number: "", isWhatsApp: false }],
    socialMedia: [],
    description: "",
    photo: null,
  };
}

