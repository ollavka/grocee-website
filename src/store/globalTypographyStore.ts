import { GlobalTypography } from 'cms-types'
import { create } from 'zustand'

export const useGlobalTypography = create<Omit<GlobalTypography, 'id' | 'createdAt' | 'updatedAt'>>(
  () => ({
    formErrorLabels: {
      textField: {
        invalidEmail: '',
        invalidPhoneNumber: '',
        nonEmptyString: '',
      },
      dateField: {
        invalidDate: '',
        invalidTime: '',
      },
    },
    sendMailLabels: {
      success: '',
      error: '',
    },
    cart: {
      minOrderPrice: {
        uah: 0,
      },
      minOrderPriceRequiredWarning: '',
      summary: {
        title: '',
        deliveyAmountLabel: '',
        goodsAmountLabel: '',
        discountAmountLabel: '',
        addPromocodeLabel: '',
        addCertificateLabel: '',
        totalSumLabel: '',
        addDiscountButtonLabel: '',
        checkoutButtonLabel: '',
        freeDeliveryLabel: '',
      },
      afterPayment: {
        buttons: {
          backToCartLink: '',
          backToHomeLink: '',
          downloadInvoiceButton: '',
        },
        success: {
          title: '',
          description: '',
          deliveryTime: '',
          deliveryAddress: '',
          totalSum: '',
          checkoutLoadedError: '',
        },
        canceled: {
          title: '',
          description: '',
        },
      },
      clearBasketLabel: '',
      createCheckoutError: '',
      emptyCartLabel: '',
      addToCartSuccess: '',
      addToCartError: '',
      goodsAmountLessThanMinError: '',
    },
    orderDeliveryForm: {
      firstName: {
        label: '',
        placeholder: '',
      },
      lastName: {
        label: '',
        placeholder: '',
      },
      phoneNumber: {
        label: '',
        placeholder: '',
      },
      shippingAddress: {
        label: '',
        placeholder: '',
      },
      date: {
        label: '',
        placeholder: '',
      },
      time: {
        label: '',
        placeholder: '',
      },
    },
    support: {
      links: [],
      link: {
        label: '',
        icon: {
          size: {
            width: 18,
            height: 18,
          },
        },
      },
    },
    account: {
      mainMenuAccountField: {
        title: '',
        description: '',
        link: {},
      },
    },
    productButtons: {
      addToCartButton: '',
      addedToCartButton: '',
      buyNowButton: '',
    },
    backButton: {
      label: '',
      icon: {
        icon: '',
        size: {
          width: 16,
          height: 16,
        },
      },
    },
    contactPage: {
      fullName: {
        label: '',
        placeholder: '',
      },
      email: {
        label: '',
        placeholder: '',
      },
      subject: {
        label: '',
        placeholder: '',
      },
      comment: {
        label: '',
        placeholder: '',
      },
      subtitle: '',
      sendButtonLabel: '',
    },
    searchPage: {
      productsCountTitle: '',
      searchResultTitle: '',
      emptySearchResultTitle: '',
      errorSearchResultTitle: '',
    },
    categoryPage: {
      allSubcategoriesFilterLabel: '',
      errorMessage: '',
      notFoundProductsMessage: '',
      backToHomePageLabel: '',
      filterProducts: {
        label: '',
        applyFilterButtonLabel: '',
        filterLabels: {
          promotionalOffers: '',
          trademarks: '',
          countries: '',
          specials: '',
          price: {
            label: '',
            minPrice: '',
            maxPrice: '',
          },
        },
        filterParamsChangingMessages: {
          success: '',
          pending: '',
        },
      },
      sortProducts: {
        applySortButtonLabel: '',
        label: '',
        sortOptions: [],
        sortParamsChangingMessages: {
          success: '',
          pending: '',
        },
      },
    },
    productPage: {
      generalInfo: {
        title: '',
        country: '',
        trademark: '',
        taste: '',
        alcoholPercentage: '',
        numberOfUnits: '',
        weight: '',
      },
      nutritionalValue: {
        title: '',
        energyValue: '',
        proteins: '',
        fats: '',
        carbohydrates: '',
      },
      reviewsBlock: {
        title: '',
        logInToLeaveRivewLabel: '',
        emptyReviewListLabel: '',
      },
      descriptionLabel: '',
      quantityLabel: '',
      deliveryBlock: {
        title: '',
        shop: '',
        shippingCost: '',
        fastestDeliveryTime: '',
      },
    },
    newsPage: {
      errorSearchResultTitle: '',
    },
  }),
)
