package com.example.demo.controllers.admin;

import com.example.demo.services.admin.taxon.TaxonService;
import com.example.demo.services.admin.taxon.TaxonSlugService;
import com.example.demo.services.admin.taxon.TaxonUtil;
import com.example.demo.services.common.ResultMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("admin")
public class TaxonsController {

  private final TaxonService taxonService;
  private final TaxonSlugService taxonSlugService;

  public TaxonsController(TaxonService taxonService, TaxonSlugService taxonSlugService) {
    this.taxonService = taxonService;
    this.taxonSlugService = taxonSlugService;
  }

  @GetMapping("taxon_tree")
  public List<com.example.demo.services.admin.taxon.TaxonUtil.DTO.Taxon> getTaxonTree() {
    return taxonService.getTaxonTree();
  }

  @PostMapping("taxons")
  public ResultMessage createTaxon(@Valid @RequestBody TaxonService.DTO.CreateTaxon.Request req) {
    return taxonService.createTaxon(req);
  }

  @PutMapping("taxons/{taxonId}")
  public ResultMessage editTaxon(
      @PathVariable Integer taxonId, @Valid @RequestBody TaxonService.DTO.EditTaxon.Request req) {
    return taxonService.editTaxon(taxonId, req);
  }

  @DeleteMapping("taxons/{taxonId}")
  public ResultMessage deleteTaxon(@PathVariable Integer taxonId) {
    return taxonService.deleteTaxon(taxonId);
  }

  @GetMapping("taxons/parents_for_assign")
  public List<TaxonUtil.DTO.TaxonParentItem> getAssignableTaxonParents() {
    return taxonService.getAssignableTaxonParents();
  }

  @GetMapping("taxons/{taxonId}")
  public TaxonService.DTO.GetOneTaxon.Response getOneTaxon(@PathVariable Integer taxonId) {
    return taxonService.getOneTaxon(taxonId);
  }

  @GetMapping("taxons/slug/check_unique")
  public TaxonSlugService.DTO.CheckTaxonSlugUniqueness.Response checkTaxonSlugIsUnique(
      @RequestParam(name = "slug", required = true) String slug,
      @RequestParam(name = "taxonId", required = false) Integer taxonId,
      @RequestParam(name = "parentTaxonId", required = false) Integer parentTaxonId) {
    return taxonSlugService.checkTaxonSlugIsUnique(
        new TaxonSlugService.DTO.CheckTaxonSlugUniqueness.Query(slug, taxonId, parentTaxonId));
  }

  @GetMapping("taxons/{taxonName}/generate_unique_slug")
  public TaxonSlugService.DTO.GenerateUniqueTaxonSlug.Response generateUniqueSlug(
      @PathVariable String taxonName,
      @RequestParam(name = "query", required = false) Integer parentTaxonId) {
    return taxonSlugService.generateUniqueTaxonSlug(taxonName, parentTaxonId);
  }
}
